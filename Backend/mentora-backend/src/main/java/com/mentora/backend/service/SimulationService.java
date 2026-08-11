package com.mentora.backend.service;

import com.mentora.backend.entity.Simulation;
import com.mentora.backend.repository.SimulationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SimulationService {

    private final SimulationRepository simulationRepository;

    public SimulationService(
            SimulationRepository simulationRepository
    ) {
        this.simulationRepository = simulationRepository;
    }

    // ==========================================
    // CREATE SIMULATION
    // ==========================================

    public Simulation createSimulation(Simulation simulation) {

        simulation.setStatus("PENDING");
        simulation.setCreatedAt(LocalDateTime.now());

        return simulationRepository.save(simulation);
    }

    // ==========================================
    // GET SIMULATION BY ID
    // ==========================================

    public Optional<Simulation> getSimulationById(Long id) {

        return simulationRepository.findById(id);
    }

    // ==========================================
    // GET ALL SIMULATIONS
    // ==========================================

    public List<Simulation> getAllSimulations() {

        return simulationRepository.findAll();
    }

    // ==========================================
    // GET USER SIMULATIONS
    // ==========================================

    public List<Simulation> getUserSimulations(Long userId) {

        return simulationRepository.findByUserId(userId);
    }

    // ==========================================
    // GET USER + PROBLEM SIMULATIONS
    // ==========================================

    public List<Simulation> getUserProblemSimulations(
            Long userId,
            Long problemId
    ) {

        return simulationRepository.findByUserIdAndProblemId(
                userId,
                problemId
        );
    }

    // ==========================================
    // GET USER SIMULATIONS BY LANGUAGE
    // ==========================================

    public List<Simulation> getUserSimulationsByLanguage(
            Long userId,
            String language
    ) {

        return simulationRepository.findByUserIdAndLanguage(
                userId,
                language
        );
    }

    // ==========================================
    // UPDATE SIMULATION RESULT
    // ==========================================

    public Simulation updateSimulationResult(
            Long id,
            String status,
            String executionTrace,
            String explanation,
            String videoUrl,
            String audioUrl
    ) {

        Simulation simulation = simulationRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Simulation not found"
                        )
                );

        simulation.setStatus(status);
        simulation.setExecutionTrace(executionTrace);
        simulation.setExplanation(explanation);
        simulation.setVideoUrl(videoUrl);
        simulation.setAudioUrl(audioUrl);

        if ("COMPLETED".equals(status)
                || "FAILED".equals(status)) {

            simulation.setCompletedAt(
                    LocalDateTime.now()
            );
        }

        return simulationRepository.save(simulation);
    }

    // ==========================================
    // DELETE SIMULATION
    // ==========================================

    public void deleteSimulation(Long id) {

        simulationRepository.deleteById(id);
    }
}