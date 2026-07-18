package com.truesplit.TrueSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccessActionDto {
    @NotBlank
    private String action; // APPROVE or REJECT
}