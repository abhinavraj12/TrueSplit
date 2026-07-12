package com.truesplit.TrueSplit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "groups")
public class Group {
    @Id
    private String id;
    private String name;
    private String ownerId;
    private List<String> memberIds; // convenience, but we'll use separate collection for members
    private Instant createdAt;
    private Instant updatedAt;
}
