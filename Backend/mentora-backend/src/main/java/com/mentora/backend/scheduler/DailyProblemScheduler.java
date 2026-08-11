package com.mentora.backend.scheduler;

import com.mentora.backend.entity.DailyProblem;
import com.mentora.backend.entity.Problem;
import com.mentora.backend.repository.DailyProblemRepository;
import com.mentora.backend.repository.ProblemRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DailyProblemScheduler {

    private final DailyProblemRepository dailyProblemRepository;
    private final ProblemRepository problemRepository;

    public DailyProblemScheduler(
            DailyProblemRepository dailyProblemRepository,
            ProblemRepository problemRepository
    ) {
        this.dailyProblemRepository = dailyProblemRepository;
        this.problemRepository = problemRepository;
    }

    // ==========================================
    // AUTOMATIC DAILY PROBLEM
    // Runs every day at 12:00 AM
    // ==========================================

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Kolkata")
    public void assignDailyProblem() {

        LocalDate today = LocalDate.now();

        System.out.println("======================================");
        System.out.println("Checking Mentora Daily Problem...");
        System.out.println("Date: " + today);
        System.out.println("======================================");

        // ==========================================
        // 1. CHECK IF TODAY'S PROBLEM ALREADY EXISTS
        // ==========================================

        if (dailyProblemRepository
                .findByReleaseDateAndActiveTrue(today)
                .isPresent()) {

            System.out.println(
                    "Today's daily problem already exists."
            );

            return;
        }

        // ==========================================
        // 2. GET ALL ACTIVE PROBLEMS
        // ==========================================

        List<Problem> problems =
                problemRepository.findByActiveTrue();

        if (problems.isEmpty()) {

            System.out.println(
                    "No active problems available."
            );

            return;
        }

        // ==========================================
        // 3. GET ALL PREVIOUS DAILY PROBLEMS
        // ==========================================

        List<DailyProblem> previousDailyProblems =
                dailyProblemRepository.findAll();

        // Store IDs of problems already used
        Set<Long> usedProblemIds = new HashSet<>();

        for (DailyProblem dailyProblem : previousDailyProblems) {

            if (dailyProblem.getProblem() != null &&
                    dailyProblem.getProblem().getId() != null) {

                usedProblemIds.add(
                        dailyProblem.getProblem().getId()
                );
            }
        }

        // ==========================================
        // 4. FIND A PROBLEM THAT HAS NOT BEEN USED
        // ==========================================

        Problem nextProblem = null;

        for (Problem problem : problems) {

            if (!usedProblemIds.contains(problem.getId())) {

                nextProblem = problem;
                break;
            }
        }

        // ==========================================
        // 5. IF ALL PROBLEMS HAVE BEEN USED
        // START A NEW CYCLE
        // ==========================================

        if (nextProblem == null) {

            System.out.println(
                    "All problems have been used."
            );

            System.out.println(
                    "Starting a new daily problem cycle."
            );

            nextProblem = problems.get(0);
        }

        // ==========================================
        // 6. CREATE DAILY PROBLEM
        // ==========================================

        DailyProblem dailyProblem =
                new DailyProblem(
                        nextProblem,
                        today
                );

        dailyProblemRepository.save(dailyProblem);

        // ==========================================
        // 7. LOG
        // ==========================================

        System.out.println("======================================");
        System.out.println("Mentora Daily Problem Assigned");
        System.out.println("Date: " + today);
        System.out.println(
                "Problem: " + nextProblem.getTitle()
        );
        System.out.println(
                "Problem ID: " + nextProblem.getId()
        );
        System.out.println("======================================");
    }
}