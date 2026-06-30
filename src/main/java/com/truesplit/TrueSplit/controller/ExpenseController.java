package com.truesplit.TrueSplit.controller;

import com.truesplit.TrueSplit.dto.request.CreateExpenseRequest;
import com.truesplit.TrueSplit.dto.response.ApiResponse;
import com.truesplit.TrueSplit.dto.response.ExpenseResponse;
import com.truesplit.TrueSplit.dto.response.RecentExpenseResponse;
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
}