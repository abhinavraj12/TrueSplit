package com.truesplit.TrueSplit.dto.response;

import lombok.Builder;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExpenseResponse {
    private String id;
    private String title;
    private String titleSlug;
    private String description;
    private String totalAmount;
    private String currency;
    private String splitType;
    private PaidByInfo paidBy;
    private CreatedByInfo createdBy;
    private List<ParticipantInfo> participants;
    private List<ManualSplitInfo> manualSplits;
    private Instant expenseDateTime;
    private String timezone;
    private String status;
    private List<ParticipantSettlementInfo> participantSettlement;
    private List<ImageInfo> images;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class PaidByInfo {
        private String id;
        private String name;
        private String email;
    }

    @Data
    @Builder
    public static class CreatedByInfo {
        private String id;
        private String name;
        private String email;
    }

    @Data
    @Builder
    public static class ParticipantInfo {
        private String id;
        private String name;
        private String email;
        private String avatar;
    }

    @Data
    @Builder
    public static class ManualSplitInfo {
        private String userId;
        private String amount;
    }

    @Data
    @Builder
    public static class ParticipantSettlementInfo {
        private String userId;
        private boolean settled;
        private Instant settledAt;
    }

    @Data
    @Builder
    public static class ImageInfo {
        private String url;
        private String thumbnailUrl;
        private String originalName;
        private Long size;
        private Instant uploadedAt;
    }
}
