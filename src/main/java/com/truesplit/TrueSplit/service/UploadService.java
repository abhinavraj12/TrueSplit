package com.truesplit.TrueSplit.service;

import com.cloudinary.Cloudinary;
import com.truesplit.TrueSplit.dto.request.UploadSignatureRequest;
import com.truesplit.TrueSplit.dto.response.UploadSignatureResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service for generating Cloudinary upload signatures.
 * Uses the Cloudinary SDK to create secure, signed upload URLs.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UploadService {

    private final Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "pdf"};

    /**
     * Generates a signed upload signature for Cloudinary.
     * Validates file size and extension before signing.
     *
     * @param request the upload request containing file metadata
     * @param userId  the ID of the authenticated user (for folder isolation)
     * @return the signed upload response with all required parameters
     * @throws IllegalArgumentException if file validation fails
     * @throws IllegalStateException    if the Cloudinary API secret is not configured
     */
    public UploadSignatureResponse generateSignature(UploadSignatureRequest request, String userId) {
        // 1. Validate file size
        if (request.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds the 5 MB limit.");
        }

        // 2. Validate file extension
        String filename = request.getFilename();
        String extension = getFileExtension(filename);
        if (!isAllowedExtension(extension)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: JPG, PNG, PDF.");
        }

        // 3. Prepare upload parameters
        Long timestamp = Instant.now().getEpochSecond();
        String folder = "receipts/" + userId;
        String publicId = String.format("%s/%s_%d", folder, UUID.randomUUID().toString(), timestamp);

        Map<String, Object> params = new HashMap<>();
        params.put("folder", folder);
        params.put("public_id", publicId);
        params.put("timestamp", timestamp);

        // 4. Retrieve API secret from the cloudinary bean
        String apiSecret = cloudinary.config.apiSecret;
        if (apiSecret == null || apiSecret.isEmpty()) {
            throw new IllegalStateException("Cloudinary API secret is not configured. Check your environment variables.");
        }

        // 5. Generate signature using Cloudinary's official SDK method
        String signature = cloudinary.apiSignRequest(params, apiSecret);

        log.info("Cloud name: {}", cloudinary.config.cloudName);
        log.info("API key: {}", cloudinary.config.apiKey);
        log.debug("Signature generated for publicId: {}", publicId);

        // 6. Build and return response
        return UploadSignatureResponse.builder()
                .cloudName(cloudinary.config.cloudName)
                .apiKey(cloudinary.config.apiKey)
                .timestamp(timestamp)
                .signature(signature)
                .publicId(publicId)
                .folder(folder)
                .uploadUrl("https://api.cloudinary.com/v1_1/" + cloudinary.config.cloudName + "/upload")
                .build();
    }

    /**
     * Extracts the file extension from a filename.
     *
     * @param filename the full filename
     * @return the extension in lowercase, or empty string if none
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1) {
            return "";
        }
        return filename.substring(lastDot + 1).toLowerCase();
    }

    /**
     * Checks whether the given extension is allowed.
     *
     * @param extension the file extension (lowercase)
     * @return true if allowed, false otherwise
     */
    private boolean isAllowedExtension(String extension) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equals(extension)) {
                return true;
            }
        }
        return false;
    }
}