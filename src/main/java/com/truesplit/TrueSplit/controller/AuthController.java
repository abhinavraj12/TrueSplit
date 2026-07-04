package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.dto.response.ApiResponse;
import com.truesplit.TrueSplit.dto.response.AuthResponse;
import com.truesplit.TrueSplit.model.User;
import com.truesplit.TrueSplit.service.AuthService;
import com.truesplit.TrueSplit.service.OtpService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    private final OtpService otpService;
    private final AuthService authService;

    public AuthController(OtpService otpService, AuthService authService) {
        this.otpService = otpService;
        this.authService = authService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", "Email is required."));
        }
        otpService.generateOtpAndSend(email);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "OTP sent if email is valid.")));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", "Email and OTP code are required."));
        }
        boolean verified = otpService.verifyOtp(email, code);

        if(verified) {
            return ResponseEntity.ok(ApiResponse.success(Map.of("message", "OTP verified.")));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("INVALID_OTP", "This OTP is invalid or has expired."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody User user, HttpServletResponse response) {
        AuthResponse authResponse = authService.signup(user);
        addAuthCookie(response, authResponse.getAuthToken());
        addRefreshCookie(response, authResponse.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", "Email and password are required."));
        }

        AuthResponse authResponse = authService.login(email, password);
        addAuthCookie(response, authResponse.getAuthToken());
        addRefreshCookie(response, authResponse.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody(required = false) Map<String, String> body,
                                                             HttpServletRequest request,
                                                             HttpServletResponse response) {
        String refreshToken = body != null ? body.get("refreshToken") : null;
        if (refreshToken == null) {
            refreshToken = getCookieValue(request, "TS_REFRESH");
        }

        AuthResponse authResponse = authService.refresh(refreshToken);
        addAuthCookie(response, authResponse.getAuthToken());
        addRefreshCookie(response, authResponse.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout(@RequestBody(required = false) Map<String, String> body,
                                                                   HttpServletRequest request,
                                                                   HttpServletResponse response) {
        String refreshToken = body != null ? body.get("refreshToken") : null;
        if (refreshToken == null) {
            refreshToken = getCookieValue(request, "TS_REFRESH");
        }

        authService.logout(refreshToken);
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        deleteCookie(response, "TS_AUTH", "/");
        deleteCookie(response, "TS_REFRESH", "/");
        // Also remove older refresh cookies that were scoped to previous auth paths.
        deleteCookie(response, "TS_REFRESH", "/auth");
        deleteCookie(response, "TS_REFRESH", "/auth/refresh");
        deleteCookie(response, "TS_REFRESH", "/api/v1/auth");
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "You have been signed out.")));
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("TS_AUTH", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void addRefreshCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("TS_REFRESH", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(30L * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void deleteCookie(HttpServletResponse response, String name, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(false)
                .path(path)
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}