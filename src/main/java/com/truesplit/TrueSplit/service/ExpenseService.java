package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.ExpenseRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.CreateExpenseRequest;
import com.truesplit.TrueSplit.dto.response.ExpenseResponse;
import com.truesplit.TrueSplit.dto.response.RecentExpenseResponse;
import com.truesplit.TrueSplit.exception.NotFoundException;
import com.truesplit.TrueSplit.model.Expense;
import com.truesplit.TrueSplit.model.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.Decimal128;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
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
                .orElseThrow(() -> new NotFoundException("Your account could not be found. Please sign in again."));
        String currentUserId = currentUser.getId();

        List<String> participants = new ArrayList<>(new LinkedHashSet<>(request.getParticipants()));

        // Validate paidBy is in participants
        if (!participants.contains(request.getPaidBy())) {
            throw new IllegalArgumentException("The payer must be included as a participant.");
        }

        // Validate participants exist
        for (String participantId : participants) {
            if (!userRepository.existsById(participantId)) {
                throw new IllegalArgumentException("One or more participants could not be found.");
            }
        }

        // Validate manual splits if applicable
        List<Expense.ManualSplit> manualSplits = null;
        if ("MANUAL".equals(request.getSplitType())) {
            if (request.getManualSplits() == null || request.getManualSplits().isEmpty()) {
                throw new IllegalArgumentException("Please add split amounts for a manual split.");
            }

            // CORRECTED: Calculate sum of manual splits
            BigDecimal sum = request.getManualSplits().stream()
                    .map(ms -> BigDecimal.valueOf(ms.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);  // Use add, not max or sum

            BigDecimal total = BigDecimal.valueOf(request.getTotalAmount());

            if (sum.compareTo(total) != 0) {
                throw new IllegalArgumentException("Manual split amounts must add up to the total amount.");
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
            int participantCount = participants.size();
            BigDecimal totalAmount = BigDecimal.valueOf(request.getTotalAmount());
            BigDecimal sharePerPerson = totalAmount.divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP);

            // Calculate the last person's share to avoid rounding errors
            BigDecimal lastShare = totalAmount.subtract(sharePerPerson.multiply(BigDecimal.valueOf(participantCount - 1)));

            manualSplits = new ArrayList<>();
            for (int i = 0; i < participants.size(); i++) {
                String participantId = participants.get(i);
                BigDecimal amount = (i == participantCount - 1) ? lastShare : sharePerPerson;

                Expense.ManualSplit split = new Expense.ManualSplit();
                split.setUserId(participantId);
                split.setAmount(new Decimal128(amount));
                manualSplits.add(split);
            }
        }

        //  Generate unique slug
        String slug = slugGenerator.generateUniqueSlug(request.getTitle());

        // Create expense date time
        ZoneId zoneId = resolveZoneId(request.getTimezone());
        LocalDate date = parseExpenseDate(request.getExpenseDate());
        LocalTime time = request.getExpenseTime() != null ?
                parseExpenseTime(request.getExpenseTime()) : LocalTime.now(zoneId);
        Instant expenseDateTime = LocalDateTime.of(date, time).atZone(zoneId).toInstant();
        Instant now = Instant.now();

        // Build expense entity
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setTitleSlug(slug);
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(new Decimal128(BigDecimal.valueOf(request.getTotalAmount())));
        expense.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        expense.setSplitType(request.getSplitType());
        expense.setPaidBy(request.getPaidBy());
        expense.setCreatedBy(currentUserId);
        expense.setParticipants(participants);
        expense.setManualSplits(manualSplits);
        expense.setExpenseDateTime(expenseDateTime);
        expense.setTimezone(zoneId.getId());
        expense.setStatus("ACTIVE");

        // Initialize participant settlement array
        List<Expense.ParticipantSettlement> settlements = participants.stream()
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
        expense.setCreatedAt(now);
        expense.setUpdatedAt(now);

        // Save to database
        Expense savedExpense = expenseRepository.save(expense);

        // Convert to response DTO
        return convertToResponse(savedExpense);
    }

    public ExpenseResponse getExpense(String identifier) {
        Expense expense;

        if (identifier.matches("^[0-9a-fA-F]{24}$")) {
            expense = expenseRepository.findById(identifier)
                    .orElseThrow(() -> new NotFoundException("Expense not found."));
        } else {
            expense = expenseRepository.findByTitleSlug(identifier)
                    .orElseThrow(() -> new NotFoundException("Expense not found."));
        }

        return convertToResponse(expense);
    }

    public List<RecentExpenseResponse> getRecentExpenses(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Your account could not be found. Please sign in again."));

        return expenseRepository.findExpensesByUser(
                        currentUser.getId(),
                        PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "expenseDateTime"))
                )
                .stream()
                .map(expense -> convertToRecentResponse(expense, currentUser.getId()))
                .collect(Collectors.toList());
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        Map<String, User> userMap = new HashMap<>();
        Set<String> userIds = new HashSet<>();
        userIds.add(expense.getPaidBy());
        userIds.add(expense.getCreatedBy());
        userIds.addAll(expense.getParticipants());

        userRepository.findAllById(userIds).forEach(user -> userMap.put(user.getId(), user));

        ExpenseResponse.ExpenseResponseBuilder builder = ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .titleSlug(expense.getTitleSlug())
                .description(expense.getDescription())
                .totalAmount(expense.getTotalAmount().toString())
                .currency(expense.getCurrency())
                .splitType(expense.getSplitType())
                .expenseDateTime(expense.getExpenseDateTime())
                .timezone(expense.getTimezone())
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
        if (createdByUser != null && !Objects.equals(expense.getCreatedBy(), expense.getPaidBy())) {
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
                    if (user == null) {
                        return null;
                    }
                    return ExpenseResponse.ParticipantInfo.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .avatar(user.getPicture())
                            .build();
                })
                .filter(Objects::nonNull)
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

    private RecentExpenseResponse convertToRecentResponse(Expense expense, String currentUserId) {
        Map<String, User> userMap = new HashMap<>();
        userRepository.findAllById(expense.getParticipants()).forEach(user -> userMap.put(user.getId(), user));

        List<RecentExpenseResponse.ParticipantSummary> participants = expense.getParticipants().stream()
                .map(userMap::get)
                .filter(Objects::nonNull)
                .map(user -> RecentExpenseResponse.ParticipantSummary.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .avatar(user.getPicture())
                        .build())
                .collect(Collectors.toList());

        return RecentExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .participants(participants)
                .time(expense.getExpenseDateTime())
                .pendingAmount(calculatePendingAmount(expense, currentUserId).toPlainString())
                .currency(expense.getCurrency())
                .build();
    }

    private BigDecimal calculatePendingAmount(Expense expense, String currentUserId) {
        if (expense.getManualSplits() == null || expense.getParticipantSettlement() == null) {
            return BigDecimal.ZERO;
        }

        Map<String, Boolean> settlementMap = expense.getParticipantSettlement().stream()
                .collect(Collectors.toMap(
                        Expense.ParticipantSettlement::getUserId,
                        Expense.ParticipantSettlement::isSettled,
                        (first, second) -> first
                ));

        return expense.getManualSplits().stream()
                .filter(split -> !Boolean.TRUE.equals(settlementMap.get(split.getUserId())))
                .filter(split -> Objects.equals(expense.getPaidBy(), currentUserId)
                        ? !Objects.equals(split.getUserId(), currentUserId)
                        : Objects.equals(split.getUserId(), currentUserId))
                .map(split -> split.getAmount().bigDecimalValue())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private ZoneId resolveZoneId(String timezone) {
        if (timezone == null || timezone.isBlank()) {
            return ZoneId.of("UTC");
        }
        try {
            return ZoneId.of(timezone);
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Please provide a valid timezone.");
        }
    }

    private LocalDate parseExpenseDate(String expenseDate) {
        try {
            return LocalDate.parse(expenseDate);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Please provide a valid expense date.");
        }
    }

    private LocalTime parseExpenseTime(String expenseTime) {
        try {
            return LocalTime.parse(expenseTime);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Please provide a valid expense time.");
        }
    }
}
