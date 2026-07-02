package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.UserProfileResponse;
import com.truesplit.TrueSplit.dto.response.ApiResponse;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class HomeController {

    private final UserRepository userRepository;

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "This is protected content - authenticated!";
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("UNAUTHORIZED", "Please sign in to continue."));
        }

        // Email comes from JWT subject
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRoles(),
                user.getAuthProvider(),
                user.isEmailVerified(),
                user.getPicture()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}