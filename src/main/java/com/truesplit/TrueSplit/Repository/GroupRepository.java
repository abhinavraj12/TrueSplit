package com.truesplit.TrueSplit.Repository;

import com.truesplit.TrueSplit.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByOwnerId(String ownerId);
    List<Group> findByIdIn(List<String> ids);
}
