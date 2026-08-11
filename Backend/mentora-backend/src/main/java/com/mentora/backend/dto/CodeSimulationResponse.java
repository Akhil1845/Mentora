package com.mentora.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class CodeSimulationResponse {

    private boolean success;
    private String language;
    private String problem;
    private String error;
    private Long executionTime;

    private List<CodeSimulationStep> trace =
            new ArrayList<>();

    public CodeSimulationResponse() {
    }

    public CodeSimulationResponse(
            boolean success,
            String language,
            String problem,
            String error,
            Long executionTime,
            List<CodeSimulationStep> trace
    ) {
        this.success = success;
        this.language = language;
        this.problem = problem;
        this.error = error;
        this.executionTime = executionTime;
        this.trace = trace;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(
            Long executionTime
    ) {
        this.executionTime = executionTime;
    }

    public List<CodeSimulationStep> getTrace() {
        return trace;
    }

    public void setTrace(
            List<CodeSimulationStep> trace
    ) {
        this.trace = trace;
    }
}