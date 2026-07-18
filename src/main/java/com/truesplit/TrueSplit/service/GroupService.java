package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.*;
import com.truesplit.TrueSplit.dto.request.CreateGroupRequest;
import com.truesplit.TrueSplit.dto.request.GroupResponse;
import com.truesplit.TrueSplit.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final AccessRequestRepository accessRequestRepository;
    private final UserRepository userRepository;

    // Create Group
    @Transactional
    public Group createGroup(String ownerId, CreateGroupRequest dto) {
        // Deduplicate emails and remove owner's email
        Set<String> uniqueEmails = new HashSet<>();
        if (dto.getMemberEmails() != null) {
            // Validate all emails exist first
            for (String email : dto.getMemberEmails()) {
                if (!userRepository.existsByEmail(email)) {
                    throw new IllegalArgumentException("User not found: " + email);
                }
            }
            // Now add to set (deduplicate) and filter out owner
            uniqueEmails.addAll(dto.getMemberEmails());
            // Remove owner's email if present (owner added separately with permission)
            User owner = userRepository.findById(ownerId)
                    .orElseThrow(() -> new IllegalStateException("Owner not found"));
            uniqueEmails.remove(owner.getEmail());
        }

        Group group = new Group();
        group.setName(dto.getName());
        group.setOwnerId(ownerId);
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(Instant.now());
        Group saved = groupRepository.save(group);

        // Add owner with permission
        GroupMember ownerMember = new GroupMember();
        ownerMember.setGroupId(saved.getId());
        ownerMember.setUserId(ownerId);
        ownerMember.setHasPermission(true);
        ownerMember.setJoinedAt(Instant.now());
        groupMemberRepository.save(ownerMember);

        // Add deduplicated members (without permission)
        for (String email : uniqueEmails) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
            // Safety check: if already a member (should not happen), skip
            if (!groupMemberRepository.existsByGroupIdAndUserId(saved.getId(), user.getId())) {
                GroupMember member = new GroupMember();
                member.setGroupId(saved.getId());
                member.setUserId(user.getId());
                member.setHasPermission(false);
                member.setJoinedAt(Instant.now());
                groupMemberRepository.save(member);
            }
        }
        return saved;
    }

    // Add Members (Owner only)
    @Transactional
    public void addMembers(String groupId, String userId, List<String> emails) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        if (!group.getOwnerId().equals(userId)) {
            throw new SecurityException("Only the group owner can add members");
        }

        // Deduplicate and validate emails
        Set<String> uniqueEmails = new HashSet<>(emails);
        for (String email : uniqueEmails) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
            // Skip if already a member
            if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, user.getId())) {
                GroupMember member = new GroupMember();
                member.setGroupId(groupId);
                member.setUserId(user.getId());
                member.setHasPermission(false);
                member.setJoinedAt(Instant.now());
                groupMemberRepository.save(member);
            }
        }
    }


    //Remove member from group
    @Transactional
    public void removeMember(String groupId, String userId, String memberRecordId) {
        // Check group exists and current user is the owner
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        if (!group.getOwnerId().equals(userId)) {
            throw new SecurityException("Only the group owner can remove members");
        }

        // Find the group member record by its _id
        GroupMember member = groupMemberRepository.findById(memberRecordId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found in this group"));

        // Verify the member belongs to this group
        if (!member.getGroupId().equals(groupId)) {
            throw new IllegalArgumentException("Member does not belong to this group");
        }

        // Prevent removing the owner
        if (member.getUserId().equals(group.getOwnerId())) {
            throw new IllegalArgumentException("Cannot remove the group owner");
        }

        // Delete the member record
        groupMemberRepository.deleteById(memberRecordId);
    }

    // Request Access (Non‑owner Member)
    @Transactional
    public AccessRequest requestAccess(String groupId, String requesterId) {
        GroupMember membership = groupMemberRepository.findByGroupIdAndUserId(groupId, requesterId)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group"));
        if (membership.isHasPermission()) {
            throw new IllegalArgumentException("You already have permission to create expenses for this group");
        }
        if (accessRequestRepository.findByGroupIdAndRequesterIdAndStatus(groupId, requesterId, "PENDING").isPresent()) {
            throw new IllegalArgumentException("A pending access request already exists");
        }
        AccessRequest request = new AccessRequest();
        request.setGroupId(groupId);
        request.setRequesterId(requesterId);
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        request.setUpdatedAt(Instant.now());
        return accessRequestRepository.save(request);
    }

    // Handle Access Request (Owner only)
    @Transactional
    public AccessRequest handleAccessRequest(String groupId, String requestId, String ownerId, String action) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        if (!group.getOwnerId().equals(ownerId)) {
            throw new SecurityException("Only the group owner can handle access requests");
        }
        AccessRequest request = accessRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Access request not found"));
        if (!request.getGroupId().equals(groupId)) {
            throw new IllegalArgumentException("Request does not belong to this group");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("Request already processed");
        }

        if ("APPROVE".equalsIgnoreCase(action)) {
            GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, request.getRequesterId())
                    .orElseThrow(() -> new IllegalStateException("Requester is not a member"));
            member.setHasPermission(true);
            groupMemberRepository.save(member);
            request.setStatus("APPROVED");
        } else if ("REJECT".equalsIgnoreCase(action)) {
            request.setStatus("REJECTED");
        } else {
            throw new IllegalArgumentException("Invalid action. Use APPROVE or REJECT");
        }
        request.setUpdatedAt(Instant.now());
        return accessRequestRepository.save(request);
    }

    // List Groups (Categorized)
    public GroupListResponse getUserGroups(String userId) {
        List<Group> ownedGroups = groupRepository.findByOwnerId(userId);

        List<GroupMember> memberships = groupMemberRepository.findByUserId(userId);
        List<String> memberGroupIds = memberships.stream()
                .map(GroupMember::getGroupId)
                .collect(Collectors.toList());
        List<Group> allMemberGroups = groupRepository.findAllById(memberGroupIds);

        List<Group> accessibleGroups = new ArrayList<>();
        List<Group> lockedGroups = new ArrayList<>();
        for (Group g : allMemberGroups) {
            if (g.getOwnerId().equals(userId)) continue;
            GroupMember gm = memberships.stream()
                    .filter(m -> m.getGroupId().equals(g.getId()))
                    .findFirst()
                    .orElse(null);
            if (gm != null && gm.isHasPermission()) {
                accessibleGroups.add(g);
            } else if (gm != null) {
                lockedGroups.add(g);
            }
        }

        return GroupListResponse.builder()
                .owned(ownedGroups.stream().map(g -> mapToResponse(g, userId)).collect(Collectors.toList()))
                .accessible(accessibleGroups.stream().map(g -> mapToResponse(g, userId)).collect(Collectors.toList()))
                .locked(lockedGroups.stream().map(g -> mapToResponse(g, userId)).collect(Collectors.toList()))
                .build();
    }

    // Helper: Map Group to GroupResponse
    private GroupResponse mapToResponse(Group group, String currentUserId) {
        List<GroupMember> members = groupMemberRepository.findByGroupId(group.getId());
        List<GroupResponse.GroupMemberInfo> memberInfos = members.stream()
                .map(m -> {
                    User user = userRepository.findById(m.getUserId()).orElse(null);
                    return GroupResponse.GroupMemberInfo.builder()
                            .userId(m.getUserId())
                            .name(user != null ? user.getName() : "Unknown")
                            .email(user != null ? user.getEmail() : "")
                            .hasPermission(m.isHasPermission())
                            .joinedAt(m.getJoinedAt())
                            .build();
                }).collect(Collectors.toList());

        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .ownerId(group.getOwnerId())
                .members(memberInfos)
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }

    // Inner DTO for categorized group list
    @lombok.Data
    @lombok.Builder
    public static class GroupListResponse {
        private List<GroupResponse> owned;
        private List<GroupResponse> accessible;
        private List<GroupResponse> locked;
    }
}