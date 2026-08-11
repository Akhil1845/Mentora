package com.mentora.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    // Date on which this problem becomes available
    private LocalDate releaseDate;

    // Allows us to temporarily disable a problem
    @Column(nullable = false)
    private Boolean active = true;

    public Problem() {
    }

    public Problem(
            String title,
            String description,
            String difficulty,
            String topic,
            String tags,
            Integer estimatedTime,
            LocalDate releaseDate
    ) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.topic = topic;
        this.tags = tags;
        this.estimatedTime = estimatedTime;
        this.releaseDate = releaseDate;
        this.active = true;
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

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public Boolean getActive() {
        return active;
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

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}