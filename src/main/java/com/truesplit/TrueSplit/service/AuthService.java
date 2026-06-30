package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.Repository.RefreshTokenRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.response.AuthResponse;
import com.truesplit.TrueSplit.exception.UnauthorizedException;
import com.truesplit.TrueSplit.model.Otp;
import com.truesplit.TrueSplit.model.RefreshToken;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            OtpRepository otpRepository,
            RefreshTokenRepository refreshTokenRepository,
            @Value("${jwt.expiration-ms}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-expiration-ms}") long refreshTokenExpirationMs
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpRepository = otpRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    public AuthResponse signup(User user) {

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
        User savedUser = userRepository.save(user);

        // OTP no longer needed, delete it
        otpRepository.deleteByEmail(user.getEmail());

        return createAuthResponse(savedUser);
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("Email or password is incorrect."));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Email or password is incorrect.");
        }
        return createAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Please sign in again.");
        }

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(hashToken(refreshToken))
                .orElseThrow(() -> new UnauthorizedException("Please sign in again."));

        if (storedToken.getRevokedAt() != null || storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("Your session has expired. Please sign in again.");
        }

        User user = userRepository.findById(storedToken.getUserId())
                .orElseThrow(() -> new UnauthorizedException("Please sign in again."));

        storedToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(storedToken);

        return createAuthResponse(user);
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHash(hashToken(refreshToken)).ifPresent(token -> {
            token.setRevokedAt(Instant.now());
            refreshTokenRepository.save(token);
        });
    }

    // create user (for OAuth2) if not present, return JWT
    public AuthResponse createOrGetUserFromOauth2(String name, String email, String picture, String googleId) {
        var existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return createAuthResponse(existing.get());
        }
        else {
            User u = new User();
            u.setName(name != null ? name : "GoogleUser");
            u.setEmail(email);
            u.setGoogleId(googleId);
            u.setPicture(picture);
            u.setPassword(passwordEncoder.encode("oauth2-placeholder"));
            u.setRoles(List.of("ROLE_USER"));
            u.setAuthProvider("google");
            u.setEmailVerified(true);

            User savedUser = userRepository.save(u);
            return createAuthResponse(savedUser);
        }
    }

    public boolean isEmailVerified(String email) {
        return otpRepository.findByEmail(email)
                .map(Otp::isVerified)
                .orElse(false);
    }

    private AuthResponse createAuthResponse(User user) {
        String refreshToken = generateSecureToken();
        RefreshToken storedToken = new RefreshToken();
        storedToken.setUserId(user.getId());
        storedToken.setTokenHash(hashToken(refreshToken));
        storedToken.setCreatedAt(Instant.now());
        storedToken.setExpiresAt(Instant.now().plusMillis(refreshTokenExpirationMs));
        refreshTokenRepository.save(storedToken);

        return AuthResponse.builder()
                .authToken(jwtUtil.generateToken(user.getEmail(), user.getRoles()))
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresInMs(accessTokenExpirationMs)
                .build();
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to protect session token", ex);
        }
    }
}
