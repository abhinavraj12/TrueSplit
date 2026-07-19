package com.truesplit.TrueSplit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "access_requests")
public class AccessRequest {
    @Id
    private String id;
    private String groupId;
    private String requesterId;
    private String status; // PENDING, APPROVED, REJECTED
    private Instant createdAt;
    private Instant updatedAt;
}
