package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.Repository.ExpenseRepository;
import com.truesplit.TrueSplit.Repository.GroupMemberRepository;
import com.truesplit.TrueSplit.Repository.ParticipantStatusRepository;
import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.dto.request.CreateExpenseRequest;
import com.truesplit.TrueSplit.dto.request.ImageDto;
import com.truesplit.TrueSplit.dto.request.ParticipantActionDto;
import com.truesplit.TrueSplit.dto.response.ExpenseResponse;
import com.truesplit.TrueSplit.dto.response.RecentExpenseResponse;
import com.truesplit.TrueSplit.exception.NotFoundException;
import com.truesplit.TrueSplit.model.Expense;
import com.truesplit.TrueSplit.model.GroupMember;
import com.truesplit.TrueSplit.model.ParticipantStatus;
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
    private final ParticipantStatusRepository participantStatusRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final SlugGeneratorService slugGenerator;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, String currentUserEmail) {

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Your account could not be found. Please sign in again."));
        String currentUserId = currentUser.getId();

        List<String> participants = new ArrayList<>(new LinkedHashSet<>(request.getParticipants()));

        if (!participants.contains(request.getPaidBy())) {
            throw new IllegalArgumentException("The payer must be included as a participant.");
        }

        for (String participantId : participants) {
            if (!userRepository.existsById(participantId)) {
                throw new IllegalArgumentException("One or more participants could not be found.");
            }
        }

        if (request.getGroupId() != null && !request.getGroupId().isBlank()) {
            GroupMember gm = groupMemberRepository.findByGroupIdAndUserId(request.getGroupId(), currentUserId)
                    .orElseThrow(() -> new IllegalArgumentException("You are not a member of this group or group not found"));
            if (!gm.isHasPermission()) {
                throw new SecurityException("You do not have permission to create expenses for this group.");
            }
            List<String> memberIds = groupMemberRepository.findByGroupId(request.getGroupId())
                    .stream().map(GroupMember::getUserId).collect(Collectors.toList());
            for (String pid : participants) {
                if (!memberIds.contains(pid)) {
                    throw new IllegalArgumentException("Participant " + pid + " is not a member of the group.");
                }
            }
        }

        List<Expense.ManualSplit> manualSplits = null;
        if ("MANUAL".equals(request.getSplitType())) {
            if (request.getManualSplits() == null || request.getManualSplits().isEmpty()) {
                throw new IllegalArgumentException("Please add split amounts for a manual split.");
            }

            BigDecimal sum = request.getManualSplits().stream()
                    .map(ms -> BigDecimal.valueOf(ms.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

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
            int participantCount = participants.size();
            BigDecimal totalAmount = BigDecimal.valueOf(request.getTotalAmount());
            BigDecimal sharePerPerson = totalAmount.divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP);
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

        String slug = slugGenerator.generateUniqueSlug(request.getTitle());

        ZoneId zoneId = resolveZoneId(request.getTimezone());
        LocalDate date = parseExpenseDate(request.getExpenseDate());
        LocalTime time = request.getExpenseTime() != null ?
                parseExpenseTime(request.getExpenseTime()) : LocalTime.now(zoneId);
        Instant expenseDateTime = LocalDateTime.of(date, time).atZone(zoneId).toInstant();
        Instant now = Instant.now();

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
        expense.setStatus("PENDING");
        expense.setImages(new ArrayList<>());
        expense.setCreatedAt(now);
        expense.setUpdatedAt(now);

        Expense savedExpense = expenseRepository.save(expense);

        for (String participantId : participants) {
            ParticipantStatus status = new ParticipantStatus();
            status.setExpenseId(savedExpense.getId());
            status.setUserId(participantId);
            status.setStatus(participantId.equals(request.getPaidBy()) ? "ACCEPTED" : "PENDING");
            BigDecimal share = manualSplits.stream()
                    .filter(s -> s.getUserId().equals(participantId))
                    .map(s -> s.getAmount().bigDecimalValue())
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            status.setShareAmount(share);
            status.setSettledAt(null);
            status.setCreatedAt(now);
            status.setUpdatedAt(now);
            participantStatusRepository.save(status);
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<Expense.Image> images = request.getImages().stream()
                    .map(this::convertToImageEntity)
                    .collect(Collectors.toList());
            savedExpense.setImages(images);
            savedExpense.setUpdatedAt(now);
            savedExpense = expenseRepository.save(savedExpense);
        }

        // Notify participants (stub)
        // TODO: Send notifications to non-payer participants

        return convertToResponse(savedExpense);
    }

    private Expense.Image convertToImageEntity(ImageDto dto) {
        Expense.Image image = new Expense.Image();
        image.setUrl(dto.getUrl());
        image.setOriginalName(dto.getOriginalName());
        image.setSize(dto.getSize() != null ? dto.getSize() : 0L);
        image.setUploadedAt(Instant.now());
        image.setThumbnailUrl(dto.getUrl());
        return image;
    }

    @Transactional
    public ParticipantStatus handleParticipantAction(String expenseId, String userId, ParticipantActionDto dto) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found."));
        if (!"PENDING".equals(expense.getStatus())) {
            throw new IllegalArgumentException("Expense is not in PENDING state.");
        }
        if (expense.getPaidBy().equals(userId)) {
            throw new IllegalArgumentException("Payer cannot accept or reject their own expense.");
        }

        ParticipantStatus status = participantStatusRepository.findByExpenseIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new IllegalArgumentException("User is not a participant of this expense."));
        if (!"PENDING".equals(status.getStatus())) {
            throw new IllegalArgumentException("You have already " + status.getStatus().toLowerCase() + " this expense.");
        }

        String action = dto.getAction().toUpperCase();
        if ("ACCEPT".equals(action)) {
            status.setStatus("ACCEPTED");
            status.setUpdatedAt(Instant.now());
            participantStatusRepository.save(status);

            List<ParticipantStatus> allStatuses = participantStatusRepository.findByExpenseId(expenseId);
            boolean allAccepted = allStatuses.stream().allMatch(s -> "ACCEPTED".equals(s.getStatus()));
            if (allAccepted) {
                expense.setStatus("ACTIVE");
                expense.setUpdatedAt(Instant.now());
                expenseRepository.save(expense);
            }
        } else if ("REJECT".equals(action)) {
            status.setStatus("REJECTED");
            status.setUpdatedAt(Instant.now());
            participantStatusRepository.save(status);

            removeParticipantAndRecalculate(expense, userId);

            List<ParticipantStatus> remaining = participantStatusRepository.findByExpenseId(expenseId)
                    .stream().filter(s -> !"REJECTED".equals(s.getStatus())).collect(Collectors.toList());
            if (remaining.size() == 1 && remaining.get(0).getUserId().equals(expense.getPaidBy())) {
                expense.setStatus("CANCELLED");
                expense.setUpdatedAt(Instant.now());
                expenseRepository.save(expense);
            }
        } else {
            throw new IllegalArgumentException("Action must be ACCEPT or REJECT.");
        }

        return status;
    }

    private void removeParticipantAndRecalculate(Expense expense, String userId) {
        expense.getParticipants().remove(userId);

        List<Expense.ManualSplit> currentSplits = expense.getManualSplits();

        if ("EQUAL".equals(expense.getSplitType())) {
            List<String> remaining = expense.getParticipants();
            BigDecimal total = expense.getTotalAmount().bigDecimalValue();
            List<Expense.ManualSplit> newSplits = calculateEqualSplits(total, remaining);
            expense.setManualSplits(newSplits);

            for (Expense.ManualSplit split : newSplits) {
                ParticipantStatus ps = participantStatusRepository
                        .findByExpenseIdAndUserId(expense.getId(), split.getUserId())
                        .orElseThrow(() -> new IllegalStateException("Participant status not found."));
                ps.setShareAmount(split.getAmount().bigDecimalValue());
                ps.setUpdatedAt(Instant.now());
                participantStatusRepository.save(ps);
            }
        } else {
            BigDecimal rejectedShare = currentSplits.stream()
                    .filter(s -> s.getUserId().equals(userId))
                    .map(s -> s.getAmount().bigDecimalValue())
                    .findFirst().orElse(BigDecimal.ZERO);

            Expense.ManualSplit payerSplit = currentSplits.stream()
                    .filter(s -> s.getUserId().equals(expense.getPaidBy()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Payer split not found."));
            BigDecimal newPayerShare = payerSplit.getAmount().bigDecimalValue().add(rejectedShare);
            payerSplit.setAmount(new Decimal128(newPayerShare));

            currentSplits.removeIf(s -> s.getUserId().equals(userId));
            expense.setManualSplits(currentSplits);

            ParticipantStatus payerStatus = participantStatusRepository
                    .findByExpenseIdAndUserId(expense.getId(), expense.getPaidBy())
                    .orElseThrow(() -> new IllegalStateException("Payer status not found."));
            payerStatus.setShareAmount(newPayerShare);
            payerStatus.setUpdatedAt(Instant.now());
            participantStatusRepository.save(payerStatus);
        }
        expense.setUpdatedAt(Instant.now());
        expenseRepository.save(expense);
    }

    private List<Expense.ManualSplit> calculateEqualSplits(BigDecimal totalAmount, List<String> participants) {
        int count = participants.size();
        BigDecimal share = totalAmount.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
        BigDecimal remainder = totalAmount.subtract(share.multiply(BigDecimal.valueOf(count)));
        List<Expense.ManualSplit> splits = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            BigDecimal amount = (i == count - 1) ? share.add(remainder) : share;
            Expense.ManualSplit split = new Expense.ManualSplit();
            split.setUserId(participants.get(i));
            split.setAmount(new Decimal128(amount));
            splits.add(split);
        }
        return splits;
    }

    @Transactional
    public void settleExpense(String expenseId, String userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found."));
        if (!expense.getPaidBy().equals(userId)) {
            throw new SecurityException("Only the payer can mark the expense as settled.");
        }
        if (!"ACTIVE".equals(expense.getStatus()) && !"PENDING".equals(expense.getStatus())) {
            throw new IllegalArgumentException("Expense cannot be settled in its current state.");
        }

        List<ParticipantStatus> statuses = participantStatusRepository.findByExpenseId(expenseId);
        for (ParticipantStatus ps : statuses) {
            ps.setStatus("SETTLED");
            ps.setSettledAt(Instant.now());
            ps.setUpdatedAt(Instant.now());
            participantStatusRepository.save(ps);
        }
        expense.setStatus("SETTLED");
        expense.setUpdatedAt(Instant.now());
        expenseRepository.save(expense);
    }

    @Transactional
    public void cancelExpense(String expenseId, String userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found."));

        if (!expense.getPaidBy().equals(userId)) {
            throw new SecurityException("Only the payer can cancel this expense.");
        }

        if ("SETTLED".equals(expense.getStatus()) || "CANCELLED".equals(expense.getStatus())) {
            throw new IllegalArgumentException("Expense cannot be cancelled in its current state.");
        }

        List<ParticipantStatus> statuses = participantStatusRepository.findByExpenseId(expenseId);
        boolean anySettled = statuses.stream().anyMatch(s -> "SETTLED".equals(s.getStatus()));
        if (anySettled) {
            throw new IllegalArgumentException("Cannot cancel expense because one or more participants have already settled.");
        }

        expense.setStatus("CANCELLED");
        expense.setUpdatedAt(Instant.now());
        expenseRepository.save(expense);

        for (ParticipantStatus ps : statuses) {
            if (!"REJECTED".equals(ps.getStatus())) {
                ps.setStatus("CANCELLED");
                ps.setUpdatedAt(Instant.now());
                participantStatusRepository.save(ps);
            }
        }
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
        List<ParticipantStatus> statuses = participantStatusRepository.findByExpenseId(expense.getId());
        Map<String, ParticipantStatus> statusMap = statuses.stream()
                .collect(Collectors.toMap(ParticipantStatus::getUserId, s -> s));

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

        User paidByUser = userMap.get(expense.getPaidBy());
        if (paidByUser != null) {
            builder.paidBy(ExpenseResponse.PaidByInfo.builder()
                    .id(paidByUser.getId())
                    .name(paidByUser.getName())
                    .email(paidByUser.getEmail())
                    .build());
        }

        User createdByUser = userMap.get(expense.getCreatedBy());
        if (createdByUser != null && !Objects.equals(expense.getCreatedBy(), expense.getPaidBy())) {
            builder.createdBy(ExpenseResponse.CreatedByInfo.builder()
                    .id(createdByUser.getId())
                    .name(createdByUser.getName())
                    .email(createdByUser.getEmail())
                    .build());
        }

        List<ExpenseResponse.ParticipantInfo> participantInfos = expense.getParticipants().stream()
                .map(participantId -> {
                    User user = userMap.get(participantId);
                    if (user == null) return null;
                    return ExpenseResponse.ParticipantInfo.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .avatar(user.getPicture())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        builder.participants(participantInfos);

        if (expense.getManualSplits() != null) {
            List<ExpenseResponse.ManualSplitInfo> splitInfos = expense.getManualSplits().stream()
                    .map(split -> ExpenseResponse.ManualSplitInfo.builder()
                            .userId(split.getUserId())
                            .amount(split.getAmount().toString())
                            .build())
                    .collect(Collectors.toList());
            builder.manualSplits(splitInfos);
        }

        if (statusMap != null && !statusMap.isEmpty()) {
            List<ExpenseResponse.ParticipantSettlementInfo> settlementInfos = expense.getParticipants().stream()
                    .map(participantId -> {
                        ParticipantStatus ps = statusMap.get(participantId);
                        if (ps == null) return null;
                        return ExpenseResponse.ParticipantSettlementInfo.builder()
                                .userId(ps.getUserId())
                                .settled("SETTLED".equals(ps.getStatus()))
                                .settledAt(ps.getSettledAt())
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            builder.participantSettlement(settlementInfos);
        }

        if (expense.getImages() != null && !expense.getImages().isEmpty()) {
            List<ExpenseResponse.ImageInfo> imageInfos = expense.getImages().stream()
                    .map(img -> ExpenseResponse.ImageInfo.builder()
                            .url(img.getUrl())
                            .thumbnailUrl(img.getThumbnailUrl())
                            .originalName(img.getOriginalName())
                            .size(img.getSize())
                            .uploadedAt(img.getUploadedAt())
                            .build())
                    .collect(Collectors.toList());
            builder.images(imageInfos);
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
                .titleSlug(expense.getTitleSlug())
                .participants(participants)
                .time(expense.getExpenseDateTime())
                .pendingAmount(calculatePendingAmount(expense, currentUserId).toPlainString())
                .currency(expense.getCurrency())
                .build();
    }

    private BigDecimal calculatePendingAmount(Expense expense, String currentUserId) {
        List<ParticipantStatus> statuses = participantStatusRepository.findByExpenseId(expense.getId());
        Map<String, Boolean> settlementMap = statuses.stream()
                .collect(Collectors.toMap(
                        ParticipantStatus::getUserId,
                        s -> "SETTLED".equals(s.getStatus()),
                        (first, second) -> first
                ));

        if (expense.getManualSplits() == null) {
            return BigDecimal.ZERO;
        }

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