package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.dto.response.ApiResponse;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Health check endpoint.
     * Returns the status of the application and its dependencies.
     * @return ApiResponse with health status details
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("timestamp", Instant.now().toEpochMilli());
        healthData.put("service", "TrueSplit");
        healthData.put("version", "v1");
        healthData.put("database", checkDatabaseConnection() ? "UP" : "DOWN");

        return ResponseEntity.ok(ApiResponse.success(healthData));
    }

    /**
     * Checks MongoDB connectivity by executing a simple ping command.
     * Returns true if the database is reachable and responsive.
     * @return true if database is accessible
     */
    private boolean checkDatabaseConnection() {
        try {
            // Execute a simple ping command to check MongoDB connectivity
            mongoTemplate.executeCommand("{ ping: 1 }");
            return true;
        } catch (Exception e) {
            // Database is unreachable or credentials are invalid
            return false;
        }
    }
}