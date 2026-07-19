package com.truesplit.TrueSplit.service;


import com.truesplit.TrueSplit.Repository.FriendRequestRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.FriendRequestDto;
import com.truesplit.TrueSplit.dto.request.FriendResponse;
import com.truesplit.TrueSplit.model.FriendRequest;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public FriendRequest sendFriendRequest(String senderId, String emailAddress, FriendRequestDto dto) {
        User recipient = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User with this email not found"));

        if (senderId.equals(recipient.getId())) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself");
        }

        // check if already friends (you can add a friend list or use a separate Friend collection)
        // For simplicity, we'll just check pending/accepted requests
        boolean exists = friendRequestRepository.existsBySenderIdAndRecipientIdAndStatusIn(
                senderId, recipient.getId(), List.of("PENDING", "ACCEPTED")
        );
        if (exists) {
            throw new IllegalArgumentException("Friend request already exists or you are already friends");
        }

        FriendRequest request = new FriendRequest();
        request.setSenderId(senderId);
        request.setSenderEmail(emailAddress);
        request.setRecipientId(recipient.getId());
        request.setRecipientEmail(recipient.getEmail());
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        request.setUpdatedAt(Instant.now());
        return friendRequestRepository.save(request);
    }

    @Transactional
    public FriendRequest acceptFriendRequest(String requestId, String userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        if (!request.getRecipientId().equals(userId)) {
            throw new SecurityException("You are not the recipient of this request");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("Request is already processed");
        }
        request.setStatus("ACCEPTED");
        request.setUpdatedAt(Instant.now());
        // Optionally create a Friend entity or maintain a list in User
        return friendRequestRepository.save(request);
    }

    @Transactional
    public FriendRequest rejectFriendRequest(String requestId, String userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        if (!request.getRecipientId().equals(userId)) {
            throw new SecurityException("You are not the recipient of this request");
        }
        request.setStatus("REJECTED");
        request.setUpdatedAt(Instant.now());
        return friendRequestRepository.save(request);
    }

    public List<FriendResponse> getFriends(String userId) {
        // Get all accepted requests where user is sender or recipient
        // This is simplified – you might want to maintain a Friend collection
        List<FriendRequest> sent = friendRequestRepository.findBySenderIdAndStatus(userId, "ACCEPTED");
        List<FriendRequest> received = friendRequestRepository.findByRecipientIdAndStatus(userId, "ACCEPTED");
        // Build list of friend user IDs
        List<String> friendIds = sent.stream().map(FriendRequest::getRecipientId).collect(Collectors.toList());
        friendIds.addAll(received.stream().map(FriendRequest::getSenderId).collect(Collectors.toList()));
        // Fetch users
        List<User> users = userRepository.findAllById(friendIds);
        return users.stream().map(u -> FriendResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .avatar(u.getPicture())
                .addedAt(Instant.now()) // we could store friendship creation time
                .build()).collect(Collectors.toList());
    }

    public List<FriendRequest> getPendingRequestsForUser(String userId) {
        return friendRequestRepository.findByRecipientIdAndStatus(userId, "PENDING");
    }
}
