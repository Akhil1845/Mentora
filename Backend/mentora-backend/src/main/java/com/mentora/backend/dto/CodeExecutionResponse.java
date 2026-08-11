package com.mentora.backend.dto;

public class CodeExecutionResponse {

    private boolean success;
    private String output;
    private String error;
    private Long executionTime;

    public CodeExecutionResponse() {
    }

    public CodeExecutionResponse(
            boolean success,
            String output,
            String error,
            Long executionTime
    ) {
        this.success = success;
        this.output = output;
        this.error = error;
        this.executionTime = executionTime;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
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

    public void setExecutionTime(Long executionTime) {
        this.executionTime = executionTime;
    }
}