package com.truesplit.TrueSplit.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorDetails error;
    private Metadata metadata;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(data);
        response.setMetadata(new Metadata(Instant.now(), "v1"));
        return response;
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setError(new ErrorDetails(code, message));
        response.setMetadata(new Metadata(Instant.now(), "v1"));
        return response;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetails {
        private String code;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metadata {
        private Instant timestamp;
        private String apiVersion;
    }
}
