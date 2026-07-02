package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends MongoRepository<Expense, String> {

    Optional<Expense> findByTitleSlug(String titleSlug);

    Page<Expense> findByCreatedBy(String userId, Pageable pageable);

    Page<Expense> findByParticipantsContaining(String userId, Pageable pageable);

    @Query("{ 'participants': ?0, 'status': 'ACTIVE' }")
    List<Expense> findActiveExpensesByParticipant(String userId);

    @Query("{ '$or': [ { 'createdBy': ?0 }, { 'participants': ?0 } ], 'status': 'ACTIVE' }")
    Page<Expense> findExpensesByUser(String userId, Pageable pageable);

    boolean existsByTitleSlug(String titleSlug);
}
