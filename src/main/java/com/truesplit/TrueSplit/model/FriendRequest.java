package com.truesplit.TrueSplit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "friend_requests")
@CompoundIndex(name = "sender_recipient_idx", def = "{'senderId': 1, 'recipientId': 1}", unique = true)
public class FriendRequest {
    @Id
    private String id;
    private String senderId;
    private String senderEmail;
    private String recipientId;
    private String recipientEmail;
    private String status; // PENDING, ACCEPTED, REJECTED
    private Instant createdAt;
    private Instant updatedAt;
}
