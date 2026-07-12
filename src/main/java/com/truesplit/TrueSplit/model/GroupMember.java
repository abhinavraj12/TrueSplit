package com.truesplit.TrueSplit.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@Document(collection = "group_members")
@CompoundIndex(name = "group_user_idx", def = "{'groupId': 1, 'userId': 1}", unique = true)
public class GroupMember {
    @Id
    private String id;
    private String groupId;

    @Field("userId")
    private String userId;
    private boolean hasPermission; // ability to create expenses for the group
    private Instant joinedAt;
}
