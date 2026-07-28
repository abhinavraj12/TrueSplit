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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Authentication authentication) {

        String userId = getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "expenseDateTime"));
        Page<ExpenseResponse> expensePage = expenseService.getUserExpenses(userId, pageable, status, search);
        return ResponseEntity.ok(ApiResponse.success(expensePage));
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

    @PatchMapping("/{expenseId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelExpense(
            @PathVariable String expenseId,
            Authentication auth) {
        String userId = getUserId(auth);
        expenseService.cancelExpense(expenseId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{expenseId}/participants/{userId}/request-payment")
    public ResponseEntity<ApiResponse<Void>> requestPayment(
            @PathVariable String expenseId,
            @PathVariable String userId,
            Authentication auth) {
        String currentUserId = getUserId(auth);
        if (!currentUserId.equals(userId)) {
            throw new SecurityException("You can only request payment for yourself.");
        }
        expenseService.requestPayment(expenseId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expenseId}/participants/{userId}/approve-payment")
    public ResponseEntity<ApiResponse<Void>> approvePayment(
            @PathVariable String expenseId,
            @PathVariable String userId,
            Authentication auth) {
        String payerId = getUserId(auth);
        expenseService.approvePayment(expenseId, payerId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expenseId}/participants/{userId}/reject-payment")
    public ResponseEntity<ApiResponse<Void>> rejectPayment(
            @PathVariable String expenseId,
            @PathVariable String userId,
            Authentication auth) {
        String payerId = getUserId(auth);
        expenseService.rejectPayment(expenseId, payerId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expenseId}/participants/approve-all")
    public ResponseEntity<ApiResponse<Void>> approveAllPayments(
            @PathVariable String expenseId,
            Authentication auth) {
        String payerId = getUserId(auth);
        expenseService.approveAllPayments(expenseId, payerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expenseId}/participants/{userId}/cancel-request")
    public ResponseEntity<ApiResponse<Void>> cancelPaymentRequest(
            @PathVariable String expenseId,
            @PathVariable String userId,
            Authentication auth) {
        String currentUserId = getUserId(auth);
        if (!currentUserId.equals(userId)) {
            throw new SecurityException("You can only cancel your own payment request.");
        }
        expenseService.cancelPaymentRequest(expenseId, userId);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"))
                .getId();
    }
}