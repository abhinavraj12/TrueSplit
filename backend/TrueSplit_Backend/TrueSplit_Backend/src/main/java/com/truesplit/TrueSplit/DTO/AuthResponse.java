package com.truesplit.TrueSplit.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Data Transfer Object for Authentication Response.
 * Used to return the JWT to the client upon successful login or registration.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
}
