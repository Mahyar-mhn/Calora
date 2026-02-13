package com.calora.backend.repository;

import com.calora.backend.model.ExploreMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExploreMessageRepository extends JpaRepository<ExploreMessage, Long> {

    @Query("""
        select m from ExploreMessage m
        where (m.fromUser.id = :userId and m.toUser.id = :withId)
           or (m.fromUser.id = :withId and m.toUser.id = :userId)
        order by m.createdAt asc
    """)
    List<ExploreMessage> findConversation(@Param("userId") Long userId, @Param("withId") Long withId);

    void deleteByFromUserIdOrToUserId(Long fromUserId, Long toUserId);

    List<ExploreMessage> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(Long fromUserId, Long toUserId);
}
