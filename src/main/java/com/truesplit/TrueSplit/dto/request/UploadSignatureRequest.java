package com.truesplit.TrueSplit.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UploadSignatureRequest {

    @NotBlank(message = "Filename is required")
    private String filename;

    @NotNull(message = "File size is required")
    @Max(value = 5 * 1024 * 1024, message = "File size must not exceed 5 MB")
    private Long size;

    private String folder;
}