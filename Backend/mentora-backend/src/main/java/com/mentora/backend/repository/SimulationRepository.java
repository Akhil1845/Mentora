package com.mentora.backend.repository;

import com.mentora.backend.entity.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationRepository
        extends JpaRepository<Simulation, Long> {

    // Get all simulations of a user
    List<Simulation> findByUserId(Long userId);

    // Get simulations for a problem
    List<Simulation> findByProblemId(Long problemId);

    // Get simulations of a user for a problem
    List<Simulation> findByUserIdAndProblemId(
            Long userId,
            Long problemId
    );

    // Get simulations by language
    List<Simulation> findByUserIdAndLanguage(
            Long userId,
            String language
    );
}