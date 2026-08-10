package com.mentora.backend.service;

import com.mentora.backend.entity.Problem;
import com.mentora.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    // Get all problems
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // Get problem by ID
    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
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