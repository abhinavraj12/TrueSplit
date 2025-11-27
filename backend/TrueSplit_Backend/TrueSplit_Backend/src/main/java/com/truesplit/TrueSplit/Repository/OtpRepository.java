package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OtpRepository extends MongoRepository<Otp, String> {
    Optional<Otp> findByEmailAndCode(String email, String code);
    void deleteByEmail(String email);
}
