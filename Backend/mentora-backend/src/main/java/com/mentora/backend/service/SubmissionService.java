package com.mentora.backend.service;

import com.mentora.backend.entity.Submission;
import com.mentora.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    // ==========================================
    // CREATE SUBMISSION
    // ==========================================

    public Submission createSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }

    // ==========================================
    // GET SUBMISSION BY ID
    // ==========================================

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    // ==========================================
    // GET ALL SUBMISSIONS
    // ==========================================

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    // ==========================================
    // GET USER SUBMISSIONS
    // ==========================================

    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserId(userId);
    }

    // ==========================================
    // GET USER + PROBLEM SUBMISSIONS
    // ==========================================

    public List<Submission> getUserProblemSubmissions(
            Long userId,
            Long problemId
    ) {
        return submissionRepository.findByUserIdAndProblemId(
                userId,
                problemId
        );
    }

    // ==========================================
    // GET USER SUBMISSIONS BY LANGUAGE
    // ==========================================

    public List<Submission> getUserSubmissionsByLanguage(
            Long userId,
            String language
    ) {
        return submissionRepository.findByUserIdAndLanguage(
                userId,
                language
        );
    }

    // ==========================================
    // GET ACCEPTED SUBMISSIONS
    // ==========================================

    public List<Submission> getAcceptedSubmissions(Long userId) {
        return submissionRepository.findByUserIdAndStatus(
                userId,
                "ACCEPTED"
        );
    }

    // ==========================================
    // GET ACCEPTED SUBMISSIONS BY LANGUAGE
    // ==========================================

    public List<Submission> getAcceptedSubmissionsByLanguage(
            Long userId,
            String language
    ) {
        return submissionRepository
                .findByUserIdAndLanguageAndStatus(
                        userId,
                        language,
                        "ACCEPTED"
                );
    }

    // ==========================================
    // DELETE SUBMISSION
    // ==========================================

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }
}