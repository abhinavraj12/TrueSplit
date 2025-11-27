package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.service.AuthService;
import com.truesplit.TrueSplit.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final OtpService otpService;
    private final AuthService authService;
    private final OtpRepository otpRepository;

    public AuthController(OtpService otpService, AuthService authService, OtpRepository otpRepository) {
        this.otpService = otpService;
        this.authService = authService;
        this.otpRepository = otpRepository;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email is required"));
        }
        otpService.generateOtpAndSend(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent if email is valid"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and code are required"));
        }
        boolean verified = otpService.verifyOtp(email, code);

        if(verified) {
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }
    }

    // Signup must be called after OTP verified
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        // server-side: you may re-check OTP existence or call OtpRepository to ensure verification occurred
        // For simplicity, we assume client called verify-otp first; you could also store a "verified" flag
        String token = authService.signup(user);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
