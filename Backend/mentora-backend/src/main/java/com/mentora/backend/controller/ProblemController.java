package com.mentora.backend.controller;

import com.mentora.backend.entity.Problem;
import com.mentora.backend.service.ProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:5173")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // Get all problems
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    // Get problem by ID
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {

        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new problem
    @PostMapping
    public ResponseEntity<Problem> createProblem(
            @RequestBody Problem problem
    ) {
        return ResponseEntity.ok(
                problemService.createProblem(problem)
        );
    }

    // Delete a problem
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(
            @PathVariable Long id
    ) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}