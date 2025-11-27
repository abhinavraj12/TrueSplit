package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String signup(User user) {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        user.setName(user.getName());
        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPhoneNumber(String.valueOf(user.getPhoneNumber()));
        user.setRoles(List.of("ROLE_USER"));
        user.setAuthProvider("local");
        userRepository.save(user);
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
            u.setPassword(passwordEncoder.encode("oauth2user-no-password"));
            u.setRoles(List.of("ROLE_USER"));
            u.setAuthProvider("google");
            userRepository.save(u);
            return jwtUtil.generateToken(email, u.getRoles());
        }
    }
}
