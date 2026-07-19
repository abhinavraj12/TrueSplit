package com.truesplit.TrueSplit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Document(collection = "participant_statuses")
@CompoundIndex(name = "expense_user_idx", def = "{'expenseId': 1, 'userId': 1}", unique = true)
public class ParticipantStatus {
    @Id
    private String id;
    private String expenseId;
    private String userId;
    private String status; // PENDING, ACCEPTED, REJECTED, SETTLED
    private BigDecimal shareAmount;
    private Instant settledAt;
    private Instant createdAt;
    private Instant updatedAt;
}
