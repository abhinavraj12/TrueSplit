package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.DTO.AuthResponse;
import com.truesplit.TrueSplit.DTO.RegisterRequest;
import com.truesplit.TrueSplit.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller responsible for handling authentication-related API requests.
 *
 * Provides endpoints for:
 * <ul>
 *     <li>Registering new users</li>
 *     <li>Logging in existing users</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user.
     *
     * @param request Registration details sent in the request body.
     * @return HTTP 200 response with {@link AuthResponse} object.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Logs in an existing user using email and password.
     *
     * @param email The user's email (provided as query parameter).
     * @param password The user's password (provided as query parameter).
     * @return HTTP 200 response with {@link AuthResponse} object.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(authService.login(email, password));
    }
}
