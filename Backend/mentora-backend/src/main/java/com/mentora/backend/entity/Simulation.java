package com.mentora.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "simulations")
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who requested the simulation
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Problem being simulated
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    // Programming language
    @Column(nullable = false)
    private String language;

    // Student's code
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String code;

    // Current simulation status
    // PENDING, PROCESSING, COMPLETED, FAILED
    @Column(nullable = false)
    private String status;

    // AI-generated explanation
    @Column(columnDefinition = "LONGTEXT")
    private String explanation;

    // URL/path of generated video
    @Column(columnDefinition = "TEXT")
    private String videoUrl;

    // URL/path of generated audio
    @Column(columnDefinition = "TEXT")
    private String audioUrl;

    // Execution trace generated from student's code
    @Column(columnDefinition = "LONGTEXT")
    private String executionTrace;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public Simulation() {
    }

    public Simulation(
            User user,
            Problem problem,
            String language,
            String code
    ) {
        this.user = user;
        this.problem = problem;
        this.language = language;
        this.code = code;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
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

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getExecutionTrace() {
        return executionTrace;
    }

    public void setExecutionTrace(String executionTrace) {
        this.executionTrace = executionTrace;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}