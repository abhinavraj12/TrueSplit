package com.truesplit.TrueSplit.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AddGroupMembersRequest {
    private List<String> emails;
}