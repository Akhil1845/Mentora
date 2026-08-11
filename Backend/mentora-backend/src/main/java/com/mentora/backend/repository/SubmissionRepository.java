package com.mentora.backend.repository;

import com.mentora.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Get all submissions made by a user
    List<Submission> findByUserId(Long userId);

    // Get all submissions for a particular problem
    List<Submission> findByProblemId(Long problemId);

    // Get submissions by user and problem
    List<Submission> findByUserIdAndProblemId(
            Long userId,
            Long problemId
    );

    // Get submissions by user and programming language
    List<Submission> findByUserIdAndLanguage(
            Long userId,
            String language
    );

    // Get accepted submissions by user
    List<Submission> findByUserIdAndStatus(
            Long userId,
            String status
    );

    // Get accepted submissions by user and language
    List<Submission> findByUserIdAndLanguageAndStatus(
            Long userId,
            String language,
            String status
    );
}