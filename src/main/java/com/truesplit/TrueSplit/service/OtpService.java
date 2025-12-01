package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.model.Otp;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
@Slf4j
public class OtpService {
    private final OtpRepository otpRepository;
    private final JavaMailSender javaMailSender;
    private final long otpValiditySeconds;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public OtpService(OtpRepository otpRepository, JavaMailSender javaMailSender,
                      @Value("${otp.validity-seconds:60}") long otpValidityInSeconds, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.otpRepository = otpRepository;
        this.javaMailSender = javaMailSender;
        this.otpValiditySeconds = otpValidityInSeconds;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateOtpAndSend(String email) {

        if(userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }

        String code = String.format("%06d", new Random().nextInt(1_000_000));

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(passwordEncoder.encode(code));   // Store hashed OTP
        //otp.setExpiresAt(Instant.parse(String.valueOf(Instant.now().plusSeconds(otpValiditySeconds))));
        otp.setExpiresAt(Instant.now().plusSeconds(otpValiditySeconds));
        otpRepository.deleteByEmail(email);
        otpRepository.save(otp);

        //send email

        SimpleMailMessage  message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for TrueSplit");
        message.setText("Your OTP code is: "+ code + "\nIt is valid for " + (otpValiditySeconds) + " second.");
        javaMailSender.send(message);
        return code;
    }

    public boolean verifyOtp(String email, String code) {
        var o = otpRepository.findByEmail(email);
        if (o.isEmpty()) return false;

        Otp otp = o.get();

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            otpRepository.deleteByEmail(email);
            return false;
        }

        // Compare hashed OTP with user input
        if (!passwordEncoder.matches(code, otp.getCode())) {
            return false;
        }

        otp.setVerified(true);
        otpRepository.save(otp);
        return true;
    }

    @Scheduled(fixedRate = 90000) // every 90 seconds
    public void deleteExpiredOtps() {
        long deletedCount = otpRepository.deleteByVerifiedFalseAndExpiresAtBefore(Instant.now());

        if (deletedCount > 0) {
            log.info("[OTP CLEANUP] Deleted {} expired & unverified OTP(s)", deletedCount);
        }
    }
}
