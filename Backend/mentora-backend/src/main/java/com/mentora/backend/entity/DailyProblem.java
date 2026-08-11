package com.mentora.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "daily_problems",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "release_date")
        }
)
public class DailyProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "release_date", nullable = false, unique = true)
    private LocalDate releaseDate;

    @Column(nullable = false)
    private Boolean active = true;

    public DailyProblem() {
    }

    public DailyProblem(
            Problem problem,
            LocalDate releaseDate
    ) {
        this.problem = problem;
        this.releaseDate = releaseDate;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}