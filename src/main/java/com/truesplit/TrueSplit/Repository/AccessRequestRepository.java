package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.AccessRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AccessRequestRepository extends MongoRepository<AccessRequest, String> {
    Optional<AccessRequest> findByGroupIdAndRequesterIdAndStatus(String groupId, String requesterId, String status);
    List<AccessRequest> findByGroupIdAndStatus(String groupId, String status);
}
