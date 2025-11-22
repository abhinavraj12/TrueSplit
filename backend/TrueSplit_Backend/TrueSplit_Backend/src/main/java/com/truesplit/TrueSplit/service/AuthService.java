package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.DTO.AuthResponse;
import com.truesplit.TrueSplit.DTO.RegisterRequest;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration and login functionality.
 * Supports authentication using either email or username.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user after checking for existing email and username.
     *
     * @param request The registration details provided by the client.
     * @return {@link AuthResponse} containing success message and user details.
     */
    public AuthResponse register(RegisterRequest request) {
        // Check duplicate email or username
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        // Save user to database
        userRepository.save(user);

        return new AuthResponse("Registered Successfully", user.getUsername(), user.getEmail());
    }

    /**
     * Logs in a user using either email or username.
     *
     * @param identifier The user's email or username.
     * @param password   The user's password.
     * @return {@link AuthResponse} containing login success message and user details.
     */
    public AuthResponse login(String identifier, String password) {
        // Try finding user by email first
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }

        return new AuthResponse("Login Successful", user.getUsername(), user.getEmail());
    }
}


/**
 * http://localhost:8080/api/auth/login?email=abhi@example.com&password=mypassword
 * http://localhost:8080/api/auth/register
 * {
 *   "name": "Abhinav Raj",
 *   "username": "abhi123",
 *   "password": "mypassword",
 *   "email": "abhi@example.com",
 *   "phoneNumber": "9999999999"
 * }
 */
