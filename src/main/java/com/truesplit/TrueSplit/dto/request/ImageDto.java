package com.truesplit.TrueSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ImageDto {

    @NotBlank(message = "Image URL is required")
    @Pattern(
            regexp = "^https://.*$",
            message = "Image URL must be a valid HTTPS URL"
    )
    private String url;

    private String originalName;
    private Long size;
}