package com.mentora.backend.controller;

import com.mentora.backend.entity.Simulation;
import com.mentora.backend.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulations")
@CrossOrigin(origins = "http://localhost:5173")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(
            SimulationService simulationService
    ) {
        this.simulationService = simulationService;
    }

    // ==========================================
    // CREATE SIMULATION
    // ==========================================

    @PostMapping
    public ResponseEntity<Simulation> createSimulation(
            @RequestBody Simulation simulation
    ) {

        return ResponseEntity.ok(
                simulationService.createSimulation(simulation)
        );
    }

    // ==========================================
    // GET SIMULATION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Simulation> getSimulationById(
            @PathVariable Long id
    ) {

        return simulationService
                .getSimulationById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // ==========================================
    // GET ALL SIMULATIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Simulation>> getAllSimulations() {

        return ResponseEntity.ok(
                simulationService.getAllSimulations()
        );
    }

    // ==========================================
    // GET USER SIMULATIONS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Simulation>> getUserSimulations(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                simulationService.getUserSimulations(userId)
        );
    }

    // ==========================================
    // GET USER + PROBLEM SIMULATIONS
    // ==========================================

    @GetMapping(
            "/user/{userId}/problem/{problemId}"
    )
    public ResponseEntity<List<Simulation>>
    getUserProblemSimulations(
            @PathVariable Long userId,
            @PathVariable Long problemId
    ) {

        return ResponseEntity.ok(
                simulationService.getUserProblemSimulations(
                        userId,
                        problemId
                )
        );
    }

    // ==========================================
    // GET USER SIMULATIONS BY LANGUAGE
    // ==========================================

    @GetMapping(
            "/user/{userId}/language/{language}"
    )
    public ResponseEntity<List<Simulation>>
    getUserSimulationsByLanguage(
            @PathVariable Long userId,
            @PathVariable String language
    ) {

        return ResponseEntity.ok(
                simulationService.getUserSimulationsByLanguage(
                        userId,
                        language
                )
        );
    }

    // ==========================================
    // UPDATE SIMULATION RESULT
    // ==========================================

    @PutMapping("/{id}/result")
    public ResponseEntity<Simulation>
    updateSimulationResult(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false)
            String executionTrace,
            @RequestParam(required = false)
            String explanation,
            @RequestParam(required = false)
            String videoUrl,
            @RequestParam(required = false)
            String audioUrl
    ) {

        return ResponseEntity.ok(
                simulationService.updateSimulationResult(
                        id,
                        status,
                        executionTrace,
                        explanation,
                        videoUrl,
                        audioUrl
                )
        );
    }

    // ==========================================
    // DELETE SIMULATION
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulation(
            @PathVariable Long id
    ) {

        simulationService.deleteSimulation(id);

        return ResponseEntity.noContent().build();
    }
}