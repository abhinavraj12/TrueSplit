package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * Repository interface for managing User data in MongoDB.
 *
 * Provides methods to find and check users by email or username.
 */
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a user by their email.
     *
     * @param email The user's email address.
     * @return An Optional containing the User if found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by their username.
     *
     * @param username The user's username.
     * @return An Optional containing the User if found.
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a user already exists with the given email.
     *
     * @param email The user's email address.
     * @return true if the email is already registered, false otherwise.
     */
    Boolean existsByEmail(String email);

    /**
     * Checks if a user already exists with the given username.
     *
     * @param username The user's username.
     * @return true if the username is already taken, false otherwise.
     */
    Boolean existsByUsername(String username);
}
