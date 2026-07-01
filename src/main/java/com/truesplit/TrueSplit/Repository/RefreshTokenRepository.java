package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void deleteByUserId(String userId);
}
