package com.truesplit.TrueSplit.Repository;


import com.truesplit.TrueSplit.model.GroupMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends MongoRepository<GroupMember, String> {
    List<GroupMember> findByGroupId(String groupId);
    Optional<GroupMember> findByGroupIdAndUserId(String groupId, String userId);
    List<GroupMember> findByUserId(String userId);
    boolean existsByGroupIdAndUserId(String groupId, String userId);
    void deleteByGroupIdAndUserId(String groupId, String userId);
}
