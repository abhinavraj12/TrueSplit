package com.truesplit.TrueSplit.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FriendRequestDto {
    @NotBlank @Email
    private String email;
}