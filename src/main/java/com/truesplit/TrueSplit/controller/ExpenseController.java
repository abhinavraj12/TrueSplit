package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.CreateExpenseRequest;
import com.truesplit.TrueSplit.dto.request.ParticipantActionDto;
import com.truesplit.TrueSplit.dto.response.ApiResponse;
import com.truesplit.TrueSplit.dto.response.ExpenseResponse;
import com.truesplit.TrueSplit.dto.response.RecentExpenseResponse;
import com.truesplit.TrueSplit.exception.NotFoundException;
import com.truesplit.TrueSplit.model.ParticipantStatus;
import com.truesplit.TrueSplit.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody CreateExpenseRequest request,
            Authentication authentication) {

        String currentUserEmail = authentication.getName();
        ExpenseResponse expense = expenseService.createExpense(request, currentUserEmail);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(expense));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<RecentExpenseResponse>>> getRecentExpenses(Authentication authentication) {
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(expenseService.getRecentExpenses(currentUserEmail)));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpense(
            @PathVariable String identifier,
            Authentication authentication) {

        ExpenseResponse expense = expenseService.getExpense(identifier);
        return ResponseEntity.ok(ApiResponse.success(expense));
    }

    @PatchMapping("/{expenseId}/participants")
    public ResponseEntity<ApiResponse<ParticipantStatus>> handleParticipantAction(
            @PathVariable String expenseId,
            @Valid @RequestBody ParticipantActionDto dto,
            Authentication auth) {
        String userId = getUserId(auth);
        ParticipantStatus status = expenseService.handleParticipantAction(expenseId, userId, dto);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @PostMapping("/{expenseId}/settle")
    public ResponseEntity<ApiResponse<Void>> settleExpense(
            @PathVariable String expenseId,
            Authentication auth) {
        String userId = getUserId(auth);
        expenseService.settleExpense(expenseId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private String getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"))
                .getId();
    }
}