package com.mentora.backend.dto;

public class CodeExecutionRequest {

    private Long problemId;
    private String language;
    private String code;
    private String input;

    public CodeExecutionRequest() {
    }

    public CodeExecutionRequest(
            Long problemId,
            String language,
            String code,
            String input
    ) {
        this.problemId = problemId;
        this.language = language;
        this.code = code;
        this.input = input;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}