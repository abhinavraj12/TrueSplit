package com.truesplit.TrueSplit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private List<String> roles;
    private String authProvider;
    private boolean emailVerified;
    private String picture;
}

