package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.model.Otp;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, OtpRepository otpRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpRepository = otpRepository;
    }

    public String signup(User user) {

        if(userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if (!isEmailVerified(user.getEmail())) {
            throw new IllegalArgumentException("Email is not verified using OTP");
        }

        user.setName(user.getName());
        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPhoneNumber(String.valueOf(user.getPhoneNumber()));
        user.setRoles(List.of("ROLE_USER"));
        user.setAuthProvider("local");
        user.setEmailVerified(true);
        userRepository.save(user);

        // OTP no longer needed, delete it
        otpRepository.deleteByEmail(user.getEmail());

        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getEmail(), user.getRoles());
    }

    // create user (for OAuth2) if not present, return JWT
    public String createOrGetUserFromOauth2(String name, String email) {
        var existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return jwtUtil.generateToken(email, existing.get().getRoles());
        }
        else {
            User u = new User();
            u.setName(name != null ? name : "GoogleUser");
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode("oauth2-placeholder"));
            u.setRoles(List.of("ROLE_USER"));
            u.setAuthProvider("google");
            u.setEmailVerified(true);

            userRepository.save(u);
            return jwtUtil.generateToken(email, u.getRoles());
        }
    }

    public boolean isEmailVerified(String email) {
        return otpRepository.findByEmail(email)
                .map(Otp::isVerified)
                .orElse(false);
    }
}
