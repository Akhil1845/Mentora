package com.mentora.backend.controller;

import com.mentora.backend.dto.CodeExecutionRequest;
import com.mentora.backend.dto.CodeExecutionResponse;
import com.mentora.backend.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "http://localhost:5173")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    public CodeExecutionController(
            CodeExecutionService codeExecutionService
    ) {
        this.codeExecutionService = codeExecutionService;
    }

    // ==========================================
    // RUN CODE
    // ==========================================

    @PostMapping("/run")
    public ResponseEntity<CodeExecutionResponse> runCode(
            @RequestBody CodeExecutionRequest request
    ) {

        CodeExecutionResponse response =
                codeExecutionService.execute(request);

        return ResponseEntity.ok(response);
    }
}