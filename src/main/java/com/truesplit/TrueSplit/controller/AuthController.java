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
        deleteCookie(response, "TS_REFRESH", "/auth");
        deleteCookie(response, "TS_REFRESH", "/auth/refresh");
        deleteCookie(response, "TS_REFRESH", "/");
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "You have been signed out.")));
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("TS_AUTH", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void addRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("TS_REFRESH", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/auth");
        cookie.setMaxAge(30 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void deleteCookie(HttpServletResponse response, String name, String path) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath(path);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
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
