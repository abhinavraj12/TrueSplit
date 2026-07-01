package com.truesplit.TrueSplit.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String authToken;
    private String refreshToken;
    private String tokenType;
    private long expiresInMs;
}
