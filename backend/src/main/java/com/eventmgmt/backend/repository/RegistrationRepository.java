package com.eventmgmt.backend.repository;

import com.eventmgmt.backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {
    List<Registration> findByUserId(String userId);
    List<Registration> findByEventId(String eventId);
    boolean existsByUserIdAndEventId(String userId, String eventId);
    int countByEventId(String eventId);
}
