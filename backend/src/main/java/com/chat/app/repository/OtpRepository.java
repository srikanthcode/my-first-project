package com.chat.app.repository;

import com.chat.app.model.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {

    /**
     * Find the most recent unverified OTP for an email
     */
    Optional<OtpRecord> findFirstByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);

    /**
     * Delete all OTP records for an email (cleanup after successful verification)
     */
    void deleteByEmail(String email);
}
