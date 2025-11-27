package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.model.Otp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class OtpService {
    private final OtpRepository otpRepository;
    private final JavaMailSender javaMailSender;
    private final long otpValiditySeconds;

    public OtpService(OtpRepository otpRepository, JavaMailSender javaMailSender,
                      @Value("${otp.validity-seconds:300}") long otpValidityInSeconds) {
        this.otpRepository = otpRepository;
        this.javaMailSender = javaMailSender;
        this.otpValiditySeconds = otpValidityInSeconds;
    }

    public String generateOtpAndSend(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000_000));

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setCode(code);
        otp.setExpiresAt(Instant.parse(String.valueOf(Instant.now().plusSeconds(otpValiditySeconds))));
        otpRepository.deleteByEmail(email);
        otpRepository.save(otp);

        //send email

        SimpleMailMessage  message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for TrueSplit");
        message.setText("Your OTP code is: "+ code + "\nIt is valid for " + (otpValiditySeconds/60) + " minutes.");
        javaMailSender.send(message);
        return code;
    }

    public boolean verifyOtp(String email, String code) {
        var o = otpRepository.findByEmailAndCode(email, code);
        if(o.isPresent()) {
            if(o.get().getExpiresAt().isAfter(Instant.now())) {
                otpRepository.deleteByEmail(email);
                return true;
            }
            else {
                otpRepository.deleteByEmail(email);
                return false;
            }
        }
        return false;
    }
}
