package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    Optional<FriendRequest> findBySenderIdAndRecipientId(String senderId, String recipientId);
    List<FriendRequest> findByRecipientIdAndStatus(String recipientId, String status);
    List<FriendRequest> findBySenderIdAndStatus(String senderId, String status);
    boolean existsBySenderIdAndRecipientIdAndStatusIn(String senderId, String recipientId, List<String> statuses);
}
