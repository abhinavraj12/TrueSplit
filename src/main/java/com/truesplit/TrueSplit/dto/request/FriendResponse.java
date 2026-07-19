package com.truesplit.TrueSplit.dto.request;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class FriendResponse {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private Instant addedAt;
}
