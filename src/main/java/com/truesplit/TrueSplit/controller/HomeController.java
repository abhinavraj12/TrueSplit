package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.UserProfileResponse;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HomeController {

    private final UserRepository userRepository;

    @GetMapping("/api/protected")
    public String protectedEndpoint() {
        return "This is protected content - authenticated!";
    }

    @GetMapping("/api/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        //return ResponseEntity.ok(authentication.getPrincipal());

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

        return ResponseEntity.ok(response);
    }

}
