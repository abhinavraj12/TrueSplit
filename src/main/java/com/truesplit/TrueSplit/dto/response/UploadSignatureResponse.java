package com.truesplit.TrueSplit.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadSignatureResponse {

    private String cloudName;
    private String apiKey;
    private Long timestamp;
    private String signature;
    private String publicId;
    private String folder;
    private String uploadUrl;
}