package com.truesplit.TrueSplit.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cloudinary configuration class.
 * Loads credentials from environment via @ConfigurationProperties(prefix = "cloudinary").
 * Provides a Cloudinary bean for upload and signature operations.
 */
@Configuration
@ConfigurationProperties(prefix = "cloudinary")
@Data
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    private String cloudName;
    private String apiKey;
    private String apiSecret;

    /**
     * Creates the Cloudinary bean using the configured credentials.
     * Validates that all required properties are present.
     *
     * @return configured Cloudinary instance
     * @throws IllegalStateException if any credential is missing or empty
     */
    @Bean
    public Cloudinary cloudinary() {
        if (cloudName == null || cloudName.isBlank() ||
            apiKey == null || apiKey.isBlank() ||
            apiSecret == null || apiSecret.isBlank()) {
            log.error("Cloudinary credentials missing: cloudName={}, apiKey={}, apiSecret={}",
                    cloudName != null ? "present" : "null",
                    apiKey != null ? "present" : "null",
                    apiSecret != null ? "present" : "null");
            throw new IllegalStateException(
                "Cloudinary credentials are not configured. " +
                "Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET " +
                "are properly set in your environment or application.yml."
            );
        }

        // Mask secret for logging (only first 6 characters)
        String maskedSecret = apiSecret.length() > 6 ? apiSecret.substring(0, 6) + "..." : "***";
        log.info("Cloudinary configured: cloudName={}, apiKey={}, apiSecret={} (length: {})",
                cloudName, apiKey, maskedSecret, apiSecret.length());

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}