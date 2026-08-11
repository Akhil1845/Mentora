package com.mentora.backend.repository;

import com.mentora.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    // Get all active problems
    List<Problem> findByActiveTrue();

    // Get problems by topic
    List<Problem> findByTopicAndActiveTrue(String topic);

    // Get problems by difficulty
    List<Problem> findByDifficultyAndActiveTrue(String difficulty);

    // Get today's released problems
    List<Problem> findByReleaseDateAndActiveTrue(LocalDate releaseDate);

    // Get problems by topic and difficulty
    List<Problem> findByTopicAndDifficultyAndActiveTrue(
            String topic,
            String difficulty
    );
}