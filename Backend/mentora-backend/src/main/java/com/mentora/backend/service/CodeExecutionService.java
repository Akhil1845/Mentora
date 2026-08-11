package com.mentora.backend.service;

import com.mentora.backend.dto.CodeExecutionRequest;
import com.mentora.backend.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

@Service
public class CodeExecutionService {

    public CodeExecutionResponse execute(
            CodeExecutionRequest request
    ) {

        if (request == null) {
            return new CodeExecutionResponse(
                    false,
                    "",
                    "Execution request cannot be null.",
                    0L
            );
        }

        if (request.getLanguage() == null
                || request.getLanguage().isBlank()) {

            return new CodeExecutionResponse(
                    false,
                    "",
                    "Programming language is required.",
                    0L
            );
        }

        if (request.getCode() == null
                || request.getCode().isBlank()) {

            return new CodeExecutionResponse(
                    false,
                    "",
                    "Code cannot be empty.",
                    0L
            );
        }

        String language = request
                .getLanguage()
                .trim()
                .toLowerCase();

        return switch (language) {

            case "java" ->
                    executeJava(request);

            case "python", "python3" ->
                    executePython(request);

            case "c" ->
                    executeC(request);

            case "c++", "cpp" ->
                    executeCpp(request);

            default ->
                    new CodeExecutionResponse(
                            false,
                            "",
                            "Unsupported programming language: "
                                    + request.getLanguage(),
                            0L
                    );
        };
    }

    private CodeExecutionResponse executeJava(
            CodeExecutionRequest request
    ) {

        /*
         * Java execution will be implemented using
         * an isolated execution environment.
         */

        return notImplemented("Java");
    }

    private CodeExecutionResponse executePython(
            CodeExecutionRequest request
    ) {

        /*
         * Python execution will be implemented using
         * an isolated execution environment.
         */

        return notImplemented("Python");
    }

    private CodeExecutionResponse executeC(
            CodeExecutionRequest request
    ) {

        /*
         * C execution will be implemented using
         * an isolated execution environment.
         */

        return notImplemented("C");
    }

    private CodeExecutionResponse executeCpp(
            CodeExecutionRequest request
    ) {

        /*
         * C++ execution will be implemented using
         * an isolated execution environment.
         */

        return notImplemented("C++");
    }

    private CodeExecutionResponse notImplemented(
            String language
    ) {

        return new CodeExecutionResponse(
                false,
                "",
                language
                        + " execution engine is not connected yet.",
                0L
        );
    }
}