package com.truesplit.TrueSplit.Repository;


import com.truesplit.TrueSplit.model.ParticipantStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ParticipantStatusRepository extends MongoRepository<ParticipantStatus, String> {
    List<ParticipantStatus> findByExpenseId(String expenseId);
    Optional<ParticipantStatus> findByExpenseIdAndUserId(String expenseId, String userId);
    void deleteByExpenseId(String expenseId);
}
