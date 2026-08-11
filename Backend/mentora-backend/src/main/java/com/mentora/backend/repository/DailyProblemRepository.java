package com.mentora.backend.repository;

import com.mentora.backend.entity.DailyProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyProblemRepository
        extends JpaRepository<DailyProblem, Long> {

    Optional<DailyProblem> findByReleaseDateAndActiveTrue(
            LocalDate releaseDate
    );

    Optional<DailyProblem> findFirstByOrderByReleaseDateDesc();
}