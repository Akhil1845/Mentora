package com.mentora.backend.controller;

import com.mentora.backend.entity.DailyProblem;
import com.mentora.backend.service.DailyProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/daily-problems")
@CrossOrigin(origins = "http://localhost:5173")
public class DailyProblemController {

    private final DailyProblemService dailyProblemService;

    public DailyProblemController(
            DailyProblemService dailyProblemService
    ) {
        this.dailyProblemService = dailyProblemService;
    }

    // ==========================================
    // GET TODAY'S PROBLEM
    // ==========================================

    @GetMapping("/today")
    public ResponseEntity<DailyProblem> getTodayProblem() {

        return dailyProblemService
                .getTodayProblem()
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // ==========================================
    // CREATE DAILY PROBLEM
    // ==========================================

    @PostMapping
    public ResponseEntity<DailyProblem> createDailyProblem(
            @RequestParam Long problemId,
            @RequestParam LocalDate releaseDate
    ) {

        return ResponseEntity.ok(
                dailyProblemService.createDailyProblem(
                        problemId,
                        releaseDate
                )
        );
    }

    // ==========================================
    // GET LATEST DAILY PROBLEM
    // ==========================================

    @GetMapping("/latest")
    public ResponseEntity<DailyProblem> getLatestDailyProblem() {

        return dailyProblemService
                .getLatestDailyProblem()
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}