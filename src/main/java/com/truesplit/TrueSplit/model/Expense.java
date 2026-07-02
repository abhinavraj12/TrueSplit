package com.truesplit.TrueSplit.model;


import lombok.*;
import org.bson.types.Decimal128;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "expenses")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Expense {
    @Id
    private String id;

    private String title;

    @Indexed(unique = true)
    private String titleSlug;

    private String description;
    private Decimal128 totalAmount;
    private String currency; // USD, INR
    private String splitType; // EQUAL, MANUAL
    private String paidBy;
    private String createdBy;
    private List<String> participants;
    private List<ManualSplit> manualSplits;
    private Instant expenseDateTime;
    private String timezone;
    private String status; // ACTIVE, COMPLETE, DELETED
    private List<ParticipantSettlement> participantSettlement;
    private List<Image> images;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    public static class ManualSplit {
        private String userId;
        private Decimal128 amount;
    }

    @Data
    public static class ParticipantSettlement {
        private String userId;
        private boolean settled;
        private Instant settledAt;
    }

    @Data
    public static class Image {
        private String url;
        private String thumbnailUrl;
        private String originalName;
        private long size;
        private Instant uploadedAt;
    }
}