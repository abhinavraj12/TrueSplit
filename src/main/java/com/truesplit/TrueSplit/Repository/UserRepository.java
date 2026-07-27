package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query("{ 'name': { '$regex': ?0, '$options': 'i' } }")
    List<User> findByNameContainingIgnoreCase(String name);
}