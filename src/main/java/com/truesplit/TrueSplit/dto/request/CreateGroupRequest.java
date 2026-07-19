package com.truesplit.TrueSplit.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class CreateGroupRequest {
    @NotBlank @Size(min = 1, max = 50)
    private String name;
    private List<String> memberEmails;
}
