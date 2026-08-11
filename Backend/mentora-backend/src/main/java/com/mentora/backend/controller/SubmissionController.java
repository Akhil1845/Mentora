package com.mentora.backend.controller;

import com.mentora.backend.entity.Submission;
import com.mentora.backend.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // ==========================================
    // CREATE SUBMISSION
    // ==========================================

    @PostMapping
    public ResponseEntity<Submission> createSubmission(
            @RequestBody Submission submission
    ) {
        return ResponseEntity.ok(
                submissionService.createSubmission(submission)
        );
    }

    // ==========================================
    // GET SUBMISSION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(
            @PathVariable Long id
    ) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // GET ALL SUBMISSIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(
                submissionService.getAllSubmissions()
        );
    }

    // ==========================================
    // GET USER SUBMISSIONS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Submission>> getUserSubmissions(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                submissionService.getUserSubmissions(userId)
        );
    }

    // ==========================================
    // GET USER + PROBLEM SUBMISSIONS
    // ==========================================

    @GetMapping("/user/{userId}/problem/{problemId}")
    public ResponseEntity<List<Submission>> getUserProblemSubmissions(
            @PathVariable Long userId,
            @PathVariable Long problemId
    ) {
        return ResponseEntity.ok(
                submissionService.getUserProblemSubmissions(
                        userId,
                        problemId
                )
        );
    }

    // ==========================================
    // GET USER SUBMISSIONS BY LANGUAGE
    // ==========================================

    @GetMapping("/user/{userId}/language/{language}")
    public ResponseEntity<List<Submission>> getUserSubmissionsByLanguage(
            @PathVariable Long userId,
            @PathVariable String language
    ) {
        return ResponseEntity.ok(
                submissionService.getUserSubmissionsByLanguage(
                        userId,
                        language
                )
        );
    }

    // ==========================================
    // GET ACCEPTED SUBMISSIONS
    // ==========================================

    @GetMapping("/user/{userId}/accepted")
    public ResponseEntity<List<Submission>> getAcceptedSubmissions(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                submissionService.getAcceptedSubmissions(userId)
        );
    }

    // ==========================================
    // GET ACCEPTED SUBMISSIONS BY LANGUAGE
    // ==========================================

    @GetMapping("/user/{userId}/language/{language}/accepted")
    public ResponseEntity<List<Submission>> getAcceptedSubmissionsByLanguage(
            @PathVariable Long userId,
            @PathVariable String language
    ) {
        return ResponseEntity.ok(
                submissionService.getAcceptedSubmissionsByLanguage(
                        userId,
                        language
                )
        );
    }

    // ==========================================
    // DELETE SUBMISSION
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(
            @PathVariable Long id
    ) {
        submissionService.deleteSubmission(id);

        return ResponseEntity.noContent().build();
    }
}