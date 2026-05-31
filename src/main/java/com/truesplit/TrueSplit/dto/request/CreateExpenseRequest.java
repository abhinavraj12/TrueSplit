package com.truesplit.TrueSplit.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CreateExpenseRequest {  // Make sure this is public
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Amount must be positive")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private Double totalAmount;

    private String currency;

    @NotBlank(message = "Split type is required")
    @Pattern(regexp = "EQUAL|MANUAL", message = "Split type must be EQUAL or MANUAL")
    private String splitType;

    @NotBlank(message = "Paid by user is required")
    private String paidBy;

    @NotEmpty(message = "At least one participant is required")
    @Size(max = 50, message = "Cannot have more than 50 participants")
    private List<String> participants;

    @NotBlank(message = "Expense date is required")
    private String expenseDate;

    private String expenseTime;

    private List<ManualSplitEntry> manualSplits;
}