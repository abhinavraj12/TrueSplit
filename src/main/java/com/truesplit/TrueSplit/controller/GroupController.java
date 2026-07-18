package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.AccessActionDto;
import com.truesplit.TrueSplit.dto.request.AddGroupMembersRequest;
import com.truesplit.TrueSplit.dto.request.CreateGroupRequest;
import com.truesplit.TrueSplit.dto.request.GroupResponse;
import com.truesplit.TrueSplit.dto.response.ApiResponse;
import com.truesplit.TrueSplit.exception.NotFoundException;
import com.truesplit.TrueSplit.model.AccessRequest;
import com.truesplit.TrueSplit.model.Group;
import com.truesplit.TrueSplit.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Group>> createGroup(
            @Valid @RequestBody CreateGroupRequest dto,
            Authentication auth) {
        String userId = getUserId(auth);
        Group group = groupService.createGroup(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(group));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<Void>> addMembers(
            @PathVariable String groupId,
            @Valid @RequestBody AddGroupMembersRequest dto,
            Authentication auth) {
        String userId = getUserId(auth);
        groupService.addMembers(groupId, userId, dto.getEmails());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable String groupId,
            @PathVariable String memberId,
            Authentication auth) {
        String userId = getUserId(auth);
        groupService.removeMember(groupId, userId, memberId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{groupId}/access-requests")
    public ResponseEntity<ApiResponse<AccessRequest>> requestAccess(
            @PathVariable String groupId,
            Authentication auth) {
        String userId = getUserId(auth);
        AccessRequest request = groupService.requestAccess(groupId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(request));
    }

    @PatchMapping("/{groupId}/access-requests/{requestId}")
    public ResponseEntity<ApiResponse<AccessRequest>> handleAccessRequest(
            @PathVariable String groupId,
            @PathVariable String requestId,
            @Valid @RequestBody AccessActionDto dto,
            Authentication auth) {
        String userId = getUserId(auth);
        AccessRequest request = groupService.handleAccessRequest(groupId, requestId, userId, dto.getAction());
        return ResponseEntity.ok(ApiResponse.success(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupResponse>>> getUserGroups(Authentication auth) {
        String userId = getUserId(auth);
        List<GroupResponse> groups = (List<GroupResponse>) groupService.getUserGroups(userId);
        return ResponseEntity.ok(ApiResponse.success(groups));
    }

    private String getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"))
                .getId();
    }
}
