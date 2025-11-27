package com.truesplit.TrueSplit.model;


import com.mongodb.client.model.Collation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "ops")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Otp {

    @Id
    private String id;
    private String email;
    private String code;
    private Instant expiresAt;
}
