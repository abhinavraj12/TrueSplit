package com.truesplit.TrueSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FriendActionDto {
    @NotBlank
    private String action; // ACCEPT or REJECT
}
