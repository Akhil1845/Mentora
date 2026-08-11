package com.mentora.backend.service;

import com.mentora.backend.entity.Problem;
import com.mentora.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    // Get all active problems
    public List<Problem> getAllProblems() {
        return problemRepository.findByActiveTrue();
    }

    // Get problem by ID
    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    // Get problems by topic
    public List<Problem> getProblemsByTopic(String topic) {
        return problemRepository.findByTopicAndActiveTrue(topic);
    }

    // Get problems by difficulty
    public List<Problem> getProblemsByDifficulty(String difficulty) {
        return problemRepository.findByDifficultyAndActiveTrue(difficulty);
    }

    // Get today's problems
    public List<Problem> getDailyProblems() {
        return problemRepository.findByReleaseDateAndActiveTrue(
                LocalDate.now()
        );
    }

    // Get problems by topic and difficulty
    public List<Problem> getProblemsByTopicAndDifficulty(
            String topic,
            String difficulty
    ) {
        return problemRepository.findByTopicAndDifficultyAndActiveTrue(
                topic,
                difficulty
        );
    }

    // Add a new problem
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    // Delete a problem
    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }
}