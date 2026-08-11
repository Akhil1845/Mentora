package com.mentora.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who submitted the solution
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Problem that was submitted
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    // Programming language used
    @Column(nullable = false)
    private String language;

    // User's submitted code
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String code;

    // ACCEPTED, WRONG_ANSWER, TIME_LIMIT, COMPILE_ERROR, etc.
    @Column(nullable = false)
    private String status;

    // Number of test cases passed
    private Integer passedTests;

    // Total number of test cases
    private Integer totalTests;

    // Execution time in milliseconds
    private Long executionTime;

    // Memory used in KB
    private Long memoryUsed;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    public Submission() {
    }

    public Submission(
            User user,
            Problem problem,
            String language,
            String code,
            String status,
            Integer passedTests,
            Integer totalTests,
            Long executionTime,
            Long memoryUsed
    ) {
        this.user = user;
        this.problem = problem;
        this.language = language;
        this.code = code;
        this.status = status;
        this.passedTests = passedTests;
        this.totalTests = totalTests;
        this.executionTime = executionTime;
        this.memoryUsed = memoryUsed;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPassedTests() {
        return passedTests;
    }

    public void setPassedTests(Integer passedTests) {
        this.passedTests = passedTests;
    }

    public Integer getTotalTests() {
        return totalTests;
    }

    public void setTotalTests(Integer totalTests) {
        this.totalTests = totalTests;
    }

    public Long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(Long executionTime) {
        this.executionTime = executionTime;
    }

    public Long getMemoryUsed() {
        return memoryUsed;
    }

    public void setMemoryUsed(Long memoryUsed) {
        this.memoryUsed = memoryUsed;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}