package com.mentora.backend.service;

import com.mentora.backend.entity.DailyProblem;
import com.mentora.backend.entity.Problem;
import com.mentora.backend.repository.DailyProblemRepository;
import com.mentora.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class DailyProblemService {

    private final DailyProblemRepository dailyProblemRepository;
    private final ProblemRepository problemRepository;

    public DailyProblemService(
            DailyProblemRepository dailyProblemRepository,
            ProblemRepository problemRepository
    ) {
        this.dailyProblemRepository = dailyProblemRepository;
        this.problemRepository = problemRepository;
    }

    // ==========================================
    // GET TODAY'S PROBLEM
    // ==========================================

    public Optional<DailyProblem> getTodayProblem() {

        return dailyProblemRepository
                .findByReleaseDateAndActiveTrue(
                        LocalDate.now()
                );
    }

    // ==========================================
    // ADD DAILY PROBLEM
    // ==========================================

    public DailyProblem createDailyProblem(
            Long problemId,
            LocalDate releaseDate
    ) {

        Problem problem = problemRepository
                .findById(problemId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Problem not found: " + problemId
                        )
                );

        DailyProblem dailyProblem =
                new DailyProblem(problem, releaseDate);

        return dailyProblemRepository.save(dailyProblem);
    }

    // ==========================================
    // GET LATEST RELEASED PROBLEM
    // ==========================================

    public Optional<DailyProblem> getLatestDailyProblem() {

        return dailyProblemRepository
                .findFirstByOrderByReleaseDateDesc();
    }
}