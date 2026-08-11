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

    // ==========================================
    // GET ALL ACTIVE PROBLEMS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(
                problemService.getAllProblems()
        );
    }

    // ==========================================
    // GET PROBLEM BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(
            @PathVariable Long id
    ) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // GET TODAY'S PROBLEMS
    // ==========================================

    @GetMapping("/daily")
    public ResponseEntity<List<Problem>> getDailyProblems() {
        return ResponseEntity.ok(
                problemService.getDailyProblems()
        );
    }

    // ==========================================
    // GET PROBLEMS BY TOPIC
    // ==========================================

    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Problem>> getProblemsByTopic(
            @PathVariable String topic
    ) {
        return ResponseEntity.ok(
                problemService.getProblemsByTopic(topic)
        );
    }

    // ==========================================
    // GET PROBLEMS BY DIFFICULTY
    // ==========================================

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Problem>> getProblemsByDifficulty(
            @PathVariable String difficulty
    ) {
        return ResponseEntity.ok(
                problemService.getProblemsByDifficulty(difficulty)
        );
    }

    // ==========================================
    // GET PROBLEMS BY TOPIC + DIFFICULTY
    // ==========================================

    @GetMapping("/topic/{topic}/difficulty/{difficulty}")
    public ResponseEntity<List<Problem>> getProblemsByTopicAndDifficulty(
            @PathVariable String topic,
            @PathVariable String difficulty
    ) {
        return ResponseEntity.ok(
                problemService.getProblemsByTopicAndDifficulty(
                        topic,
                        difficulty
                )
        );
    }

    // ==========================================
    // CREATE NEW PROBLEM
    // ==========================================

    @PostMapping
    public ResponseEntity<Problem> createProblem(
            @RequestBody Problem problem
    ) {
        return ResponseEntity.ok(
                problemService.createProblem(problem)
        );
    }

    // ==========================================
    // DELETE PROBLEM
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(
            @PathVariable Long id
    ) {
        problemService.deleteProblem(id);

        return ResponseEntity.noContent().build();
    }
}