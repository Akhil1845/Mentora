package com.mentora.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String tags;

    private Integer estimatedTime;

    public Problem() {
    }

    public Problem(
            String title,
            String description,
            String difficulty,
            String topic,
            String tags,
            Integer estimatedTime
    ) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.topic = topic;
        this.tags = tags;
        this.estimatedTime = estimatedTime;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getTopic() {
        return topic;
    }

    public String getTags() {
        return tags;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }
}