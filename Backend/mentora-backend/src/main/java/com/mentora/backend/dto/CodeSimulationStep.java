package com.mentora.backend.dto;

import java.util.Map;

public class CodeSimulationStep {

    private int step;
    private int line;
    private String event;
    private String title;
    private String description;
    private Map<String, Object> variables;

    public CodeSimulationStep() {
    }

    public CodeSimulationStep(
            int step,
            int line,
            String event,
            String title,
            String description,
            Map<String, Object> variables
    ) {
        this.step = step;
        this.line = line;
        this.event = event;
        this.title = title;
        this.description = description;
        this.variables = variables;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public int getLine() {
        return line;
    }

    public void setLine(int line) {
        this.line = line;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<String, Object> getVariables() {
        return variables;
    }

    public void setVariables(
            Map<String, Object> variables
    ) {
        this.variables = variables;
    }
}