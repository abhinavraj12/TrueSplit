package com.truesplit.TrueSplit.controller;


import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.FriendActionDto;
import com.truesplit.TrueSplit.dto.request.FriendRequestDto;
import com.truesplit.TrueSplit.dto.request.FriendResponse;
import com.truesplit.TrueSplit.dto.response.ApiResponse;

import com.truesplit.TrueSplit.exception.NotFoundException;
import com.truesplit.TrueSplit.model.FriendRequest;
import com.truesplit.TrueSplit.service.FriendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;
    private final UserRepository userRepository;

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<FriendRequest>> sendFriendRequest(
            @Valid @RequestBody FriendRequestDto dto,
            Authentication auth) {
        String userId = getUserId(auth);
        String emailAddress = auth.getName();
        FriendRequest request = friendService.sendFriendRequest(userId, emailAddress, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(request));
    }

    @PatchMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<FriendRequest>> handleFriendRequest(
            @PathVariable String requestId,
            @Valid @RequestBody FriendActionDto dto,
            Authentication auth) {
        String userId = getUserId(auth);
        FriendRequest request;
        if ("ACCEPT".equalsIgnoreCase(dto.getAction())) {
            request = friendService.acceptFriendRequest(requestId, userId);
        } else {
            request = friendService.rejectFriendRequest(requestId, userId);
        }
        return ResponseEntity.ok(ApiResponse.success(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FriendResponse>>> getFriends(Authentication auth) {
        String userId = getUserId(auth);
        List<FriendResponse> friends = friendService.getFriends(userId);
        return ResponseEntity.ok(ApiResponse.success(friends));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<ApiResponse<List<FriendRequest>>> getPendingRequests(Authentication auth) {
        String userId = getUserId(auth);
        List<FriendRequest> pending = friendService.getPendingRequestsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    private String getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"))
                .getId();
    }
}
