package com.truesplit.TrueSplit.dto.request;


import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class GroupResponse {
    private String id;
    private String name;
    private String ownerId;
    private List<GroupMemberInfo> members;
    private Instant createdAt;
    private Instant updatedAt;

    @Data @Builder
    public static class GroupMemberInfo {
        private String userId;
        private String name;
        private String email;
        private boolean hasPermission;
        private Instant joinedAt;
    }
}
