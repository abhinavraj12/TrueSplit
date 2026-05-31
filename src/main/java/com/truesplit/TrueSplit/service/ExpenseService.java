package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.ExpenseRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.CreateExpenseRequest;
import com.truesplit.TrueSplit.dto.response.ExpenseResponse;
import com.truesplit.TrueSplit.model.Expense;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.Decimal128;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final SlugGeneratorService slugGenerator;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, String currentUserEmail) {

        // Get current user from email
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        String currentUserId = currentUser.getId();

        // 1. Validate paidBy is in participants
        if (!request.getParticipants().contains(request.getPaidBy())) {
            throw new IllegalArgumentException("PaidBy user must be in participants list");
        }

        // 2. Validate participants exist
        for (String participantId : request.getParticipants()) {
            if (!userRepository.existsById(participantId)) {
                throw new IllegalArgumentException("User not found: " + participantId);
            }
        }

        // 3. Validate manual splits if applicable
        List<Expense.ManualSplit> manualSplits = null;
        if ("MANUAL".equals(request.getSplitType())) {
            if (request.getManualSplits() == null || request.getManualSplits().isEmpty()) {
                throw new IllegalArgumentException("Manual splits required for MANUAL split type");
            }

            // CORRECTED: Calculate sum of manual splits
            BigDecimal sum = request.getManualSplits().stream()
                    .map(ms -> BigDecimal.valueOf(ms.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);  // Use add, not max or sum

            BigDecimal total = BigDecimal.valueOf(request.getTotalAmount());

            if (sum.compareTo(total) != 0) {
                throw new IllegalArgumentException("Sum of manual splits (" + sum +
                        ") does not equal total amount (" + total + ")");
            }

            manualSplits = request.getManualSplits().stream()
                    .map(ms -> {
                        Expense.ManualSplit split = new Expense.ManualSplit();
                        split.setUserId(ms.getUserId());
                        split.setAmount(new Decimal128(BigDecimal.valueOf(ms.getAmount())));
                        return split;
                    })
                    .collect(Collectors.toList());
        } else if ("EQUAL".equals(request.getSplitType())) {
            // ADD THIS: EQUAL split calculation
            int participantCount = request.getParticipants().size();
            BigDecimal totalAmount = BigDecimal.valueOf(request.getTotalAmount());
            BigDecimal sharePerPerson = totalAmount.divide(BigDecimal.valueOf(participantCount), 2, BigDecimal.ROUND_HALF_UP);

            // Calculate the last person's share to avoid rounding errors
            BigDecimal lastShare = totalAmount.subtract(sharePerPerson.multiply(BigDecimal.valueOf(participantCount - 1)));

            manualSplits = new ArrayList<>();
            for (int i = 0; i < request.getParticipants().size(); i++) {
                String participantId = request.getParticipants().get(i);
                BigDecimal amount = (i == participantCount - 1) ? lastShare : sharePerPerson;

                Expense.ManualSplit split = new Expense.ManualSplit();
                split.setUserId(participantId);
                split.setAmount(new Decimal128(amount));
                manualSplits.add(split);
            }
        }

        // 4. Generate unique slug
        String slug = slugGenerator.generateUniqueSlug(request.getTitle());

        // 5. Create expense date time
        LocalDate date = LocalDate.parse(request.getExpenseDate());
        LocalTime time = request.getExpenseTime() != null ?
                LocalTime.parse(request.getExpenseTime()) : LocalTime.now();
        LocalDateTime expenseDateTime = LocalDateTime.of(date, time);

        // 6. Build expense entity
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setTitleSlug(slug);
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(new Decimal128(BigDecimal.valueOf(request.getTotalAmount())));
        expense.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        expense.setSplitType(request.getSplitType());
        expense.setPaidBy(request.getPaidBy());
        expense.setCreatedBy(currentUserId);
        expense.setParticipants(new ArrayList<>(new LinkedHashSet<>(request.getParticipants())));
        expense.setManualSplits(manualSplits);
        expense.setExpenseDateTime(expenseDateTime);
        expense.setStatus("ACTIVE");

        // Initialize participant settlement array
        List<Expense.ParticipantSettlement> settlements = request.getParticipants().stream()
                .map(participantId -> {
                    Expense.ParticipantSettlement settlement = new Expense.ParticipantSettlement();
                    settlement.setUserId(participantId);
                    settlement.setSettled(false);
                    settlement.setSettledAt(null);
                    return settlement;
                })
                .collect(Collectors.toList());
        expense.setParticipantSettlement(settlements);

        expense.setImages(new ArrayList<>());
        expense.setCreatedAt(LocalDateTime.now());
        expense.setUpdatedAt(LocalDateTime.now());

        // 7. Save to database
        Expense savedExpense = expenseRepository.save(expense);

        // 8. Convert to response DTO
        return convertToResponse(savedExpense);
    }

    public ExpenseResponse getExpense(String identifier) {
        Expense expense;

        if (identifier.matches("^[0-9a-fA-F]{24}$")) {
            expense = expenseRepository.findById(identifier)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));
        } else {
            expense = expenseRepository.findByTitleSlug(identifier)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));
        }

        return convertToResponse(expense);
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        Map<String, User> userMap = new HashMap<>();
        Set<String> userIds = new HashSet<>();
        userIds.add(expense.getPaidBy());
        userIds.add(expense.getCreatedBy());
        userIds.addAll(expense.getParticipants());

        for (String userId : userIds) {
            userRepository.findById(userId).ifPresent(user -> userMap.put(userId, user));
        }

        ExpenseResponse.ExpenseResponseBuilder builder = ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .titleSlug(expense.getTitleSlug())
                .description(expense.getDescription())
                .totalAmount(expense.getTotalAmount().toString())
                .currency(expense.getCurrency())
                .splitType(expense.getSplitType())
                .expenseDateTime(expense.getExpenseDateTime())
                .status(expense.getStatus())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt());

        // Set paid by info
        User paidByUser = userMap.get(expense.getPaidBy());
        if (paidByUser != null) {
            builder.paidBy(ExpenseResponse.PaidByInfo.builder()
                    .id(paidByUser.getId())
                    .name(paidByUser.getName())
                    .email(paidByUser.getEmail())
                    .build());
        }

        // Set created by info
        User createdByUser = userMap.get(expense.getCreatedBy());
        if (createdByUser != null) {
            builder.createdBy(ExpenseResponse.CreatedByInfo.builder()
                    .id(createdByUser.getId())
                    .name(createdByUser.getName())
                    .email(createdByUser.getEmail())
                    .build());
        }

        // Set participants info
        List<ExpenseResponse.ParticipantInfo> participantInfos = expense.getParticipants().stream()
                .map(participantId -> {
                    User user = userMap.get(participantId);
                    return ExpenseResponse.ParticipantInfo.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .avatar(user.getPicture())
                            .build();
                })
                .collect(Collectors.toList());
        builder.participants(participantInfos);

        // Set manual splits if any
        if (expense.getManualSplits() != null) {
            List<ExpenseResponse.ManualSplitInfo> splitInfos = expense.getManualSplits().stream()
                    .map(split -> ExpenseResponse.ManualSplitInfo.builder()
                            .userId(split.getUserId())
                            .amount(split.getAmount().toString())
                            .build())
                    .collect(Collectors.toList());
            builder.manualSplits(splitInfos);
        }

        // Set participant settlements
        if (expense.getParticipantSettlement() != null) {
            List<ExpenseResponse.ParticipantSettlementInfo> settlementInfos = expense.getParticipantSettlement().stream()
                    .map(settlement -> ExpenseResponse.ParticipantSettlementInfo.builder()
                            .userId(settlement.getUserId())
                            .settled(settlement.isSettled())
                            .settledAt(settlement.getSettledAt())
                            .build())
                    .collect(Collectors.toList());
            builder.participantSettlement(settlementInfos);
        }

        return builder.build();
    }
}