package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.OtpRepository;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.service.AuthService;
import com.truesplit.TrueSplit.service.OtpService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("auth")
@Slf4j
public class AuthController {

    private final OtpService otpService;
    private final AuthService authService;

    public AuthController(OtpService otpService, AuthService authService) {
        this.otpService = otpService;
        this.authService = authService;
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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
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
