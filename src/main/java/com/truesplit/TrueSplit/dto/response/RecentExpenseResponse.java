package com.truesplit.TrueSplit.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class RecentExpenseResponse {
    private String id;
    private String title;
    private String titleSlug;
    private List<ParticipantSummary> participants;
    private Instant time;
    private String pendingAmount;
    private String currency;

    @Data
    @Builder
    public static class ParticipantSummary {
        private String id;
        private String name;
        private String avatar;
    }
}