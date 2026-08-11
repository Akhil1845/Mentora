package com.mentora.backend.service;

import com.mentora.backend.dto.CodeExecutionRequest;
import com.mentora.backend.dto.CodeExecutionResponse;
import com.mentora.backend.dto.CodeSimulationResponse;
import com.mentora.backend.dto.CodeSimulationStep;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    private static final long TIMEOUT_SECONDS = 5;

    private static final String JAVA_IMAGE =
            "eclipse-temurin:21-jdk";


    // =========================================================
    // MAIN EXECUTION METHOD
    // =========================================================

    public CodeExecutionResponse execute(
            CodeExecutionRequest request
    ) {

        // -----------------------------------------------------
        // Validate request
        // -----------------------------------------------------

        if (request == null) {
            return response(
                    false,
                    "",
                    "Execution request cannot be null.",
                    0L
            );
        }

        if (request.getProblemId() == null) {
            return response(
                    false,
                    "",
                    "Problem ID is required.",
                    0L
            );
        }

        if (request.getLanguage() == null
                || request.getLanguage().isBlank()) {

            return response(
                    false,
                    "",
                    "Programming language is required.",
                    0L
            );
        }

        if (request.getCode() == null
                || request.getCode().isBlank()) {

            return response(
                    false,
                    "",
                    "Code cannot be empty.",
                    0L
            );
        }

        String language =
                request.getLanguage()
                        .trim()
                        .toLowerCase();

        // -----------------------------------------------------
        // Currently Java is enabled
        // -----------------------------------------------------

        return switch (language) {

            case "java" ->
                    executeJava(request);

            default ->
                    response(
                            false,
                            "",
                            "Currently only Java execution is enabled.",
                            0L
                    );
        };
    }


    // =========================================================
    // CODE SIMULATION
    // =========================================================

    public CodeSimulationResponse simulate(
            CodeExecutionRequest request
    ) {

        long startTime =
                System.currentTimeMillis();

        // -----------------------------------------------------
        // Validate request
        // -----------------------------------------------------

        if (request == null) {

            return simulationResponse(
                    false,
                    "",
                    "",
                    "Simulation request cannot be null.",
                    0L,
                    new ArrayList<>()
            );
        }

        if (request.getProblemId() == null) {

            return simulationResponse(
                    false,
                    request.getLanguage(),
                    "",
                    "Problem ID is required.",
                    0L,
                    new ArrayList<>()
            );
        }

        if (request.getCode() == null
                || request.getCode().isBlank()) {

            return simulationResponse(
                    false,
                    request.getLanguage(),
                    getProblemName(request.getProblemId()),
                    "Code cannot be empty.",
                    0L,
                    new ArrayList<>()
            );
        }

        String language =
                request.getLanguage() == null
                        ? ""
                        : request.getLanguage()
                        .trim()
                        .toLowerCase();

        if (!language.equals("java")) {

            return simulationResponse(
                    false,
                    language,
                    getProblemName(request.getProblemId()),
                    "Currently only Java simulation is enabled.",
                    0L,
                    new ArrayList<>()
            );
        }

        // -----------------------------------------------------
        // Currently supported simulation
        // -----------------------------------------------------

        if (request.getProblemId() == 1L) {

            // -------------------------------------------------
            // First make sure the student's code actually runs.
            // -------------------------------------------------

            CodeExecutionResponse execution =
                    execute(request);

            if (!execution.isSuccess()) {

                return simulationResponse(
                        false,
                        language,
                        "Two Sum",
                        execution.getError(),
                        System.currentTimeMillis()
                                - startTime,
                        new ArrayList<>()
                );
            }

            // -------------------------------------------------
            // Generate Two Sum execution trace
            // -------------------------------------------------

            List<CodeSimulationStep> steps =
                    buildTwoSumSimulation(
                            request.getCode()
                    );

            return simulationResponse(
                    true,
                    language,
                    "Two Sum",
                    "",
                    System.currentTimeMillis()
                            - startTime,
                    steps
            );
        }

        return simulationResponse(
                false,
                language,
                getProblemName(request.getProblemId()),
                "Simulation is not yet supported for problem ID "
                        + request.getProblemId(),
                System.currentTimeMillis()
                        - startTime,
                new ArrayList<>()
        );
    }


    // =========================================================
    // TWO SUM SIMULATION
    // =========================================================

    private List<CodeSimulationStep> buildTwoSumSimulation(
            String studentCode
    ) {

        List<CodeSimulationStep> steps =
                new ArrayList<>();

        // -----------------------------------------------------
        // Find useful line numbers from student's code
        // -----------------------------------------------------

        int loopLine =
                findLine(
                        studentCode,
                        "for"
                );

        int needLine =
                findLineContaining(
                        studentCode,
                        "target -",
                        "target - nums",
                        "target-"
                );

        int containsLine =
                findLineContaining(
                        studentCode,
                        "containsKey",
                        "contains"
                );

        int putLine =
                findLineContaining(
                        studentCode,
                        ".put",
                        "put("
                );

        int returnLine =
                findLine(
                        studentCode,
                        "return"
                );

        // -----------------------------------------------------
        // Test case
        // -----------------------------------------------------

        int[] nums =
                {2, 7, 11, 15};

        int target = 9;

        Map<String, Object> variables;

        Map<Integer, Integer> map =
                new LinkedHashMap<>();


        // =====================================================
        // STEP 1
        // =====================================================

        variables =
                new LinkedHashMap<>();

        variables.put(
                "nums",
                "[2, 7, 11, 15]"
        );

        variables.put(
                "target",
                target
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        1,
                        loopLine,
                        "START",
                        "Start Two Sum",
                        "Mentora starts executing the Two Sum solution with nums = [2, 7, 11, 15] and target = 9.",
                        variables
                )
        );


        // =====================================================
        // STEP 2
        // =====================================================

        int i = 0;

        int current =
                nums[i];

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "target",
                target
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        2,
                        loopLine,
                        "LOOP",
                        "Read first value",
                        "The loop starts at index 0. The current value is 2.",
                        variables
                )
        );


        // =====================================================
        // STEP 3
        // =====================================================

        int need =
                target - current;

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "target",
                target
        );

        variables.put(
                "need",
                need
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        3,
                        needLine,
                        "CALCULATE",
                        "Calculate required value",
                        "We need 7 because target 9 minus the current value 2 equals 7.",
                        variables
                )
        );


        // =====================================================
        // STEP 4
        // =====================================================

        boolean found =
                map.containsKey(
                        need
                );

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "need",
                need
        );

        variables.put(
                "found",
                found
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        4,
                        containsLine,
                        "CHECK",
                        "Check the HashMap",
                        "Mentora checks whether 7 already exists in the HashMap. It does not.",
                        variables
                )
        );


        // =====================================================
        // STEP 5
        // =====================================================

        map.put(
                current,
                i
        );

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        5,
                        putLine,
                        "STORE",
                        "Store the first value",
                        "The value 2 is stored in the HashMap with index 0.",
                        variables
                )
        );


        // =====================================================
        // STEP 6
        // =====================================================

        i = 1;

        current =
                nums[i];

        need =
                target - current;

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "target",
                target
        );

        variables.put(
                "need",
                need
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        6,
                        loopLine,
                        "LOOP",
                        "Read second value",
                        "The loop moves to index 1. The current value is 7.",
                        variables
                )
        );


        // =====================================================
        // STEP 7
        // =====================================================

        found =
                map.containsKey(
                        need
                );

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "need",
                need
        );

        variables.put(
                "found",
                found
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        7,
                        containsLine,
                        "FOUND",
                        "Pair found",
                        "The HashMap contains 2. Since 7 + 2 = 9, the required pair has been found.",
                        variables
                )
        );


        // =====================================================
        // STEP 8
        // =====================================================

        int[] result =
                {map.get(need), i};

        variables =
                new LinkedHashMap<>();

        variables.put(
                "i",
                i
        );

        variables.put(
                "current",
                current
        );

        variables.put(
                "need",
                need
        );

        variables.put(
                "result",
                "[0, 1]"
        );

        variables.put(
                "map",
                new LinkedHashMap<>(map)
        );

        steps.add(
                new CodeSimulationStep(
                        8,
                        returnLine,
                        "RETURN",
                        "Return the answer",
                        "The solution returns indices [0, 1]. nums[0] + nums[1] = 2 + 7 = 9.",
                        variables
                )
        );

        return steps;
    }


    // =========================================================
    // FIND LINE
    // =========================================================

    private int findLine(
            String code,
            String keyword
    ) {

        if (code == null) {
            return 0;
        }

        String[] lines =
                code.split("\\R");

        for (int i = 0; i < lines.length; i++) {

            if (lines[i].contains(keyword)) {
                return i + 1;
            }
        }

        return 0;
    }


    // =========================================================
    // FIND LINE USING MULTIPLE POSSIBILITIES
    // =========================================================

    private int findLineContaining(
            String code,
            String... keywords
    ) {

        if (code == null) {
            return 0;
        }

        String[] lines =
                code.split("\\R");

        for (int i = 0; i < lines.length; i++) {

            String line =
                    lines[i];

            for (String keyword : keywords) {

                if (line.contains(keyword)) {
                    return i + 1;
                }
            }
        }

        return 0;
    }


    // =========================================================
    // PROBLEM NAME
    // =========================================================

    private String getProblemName(
            Long problemId
    ) {

        if (problemId == null) {
            return "";
        }

        if (problemId == 1L) {
            return "Two Sum";
        }

        return "Unknown Problem";
    }


    // =========================================================
    // JAVA EXECUTION
    // =========================================================

    private CodeExecutionResponse executeJava(
            CodeExecutionRequest request
    ) {

        long startTime =
                System.currentTimeMillis();

        Path tempDirectory = null;

        try {

            // -------------------------------------------------
            // Build complete executable Java program
            // -------------------------------------------------

            String executableCode =
                    buildJavaProgram(request);

            if (executableCode == null) {

                return response(
                        false,
                        "",
                        "Unsupported problem ID: "
                                + request.getProblemId(),
                        0L
                );
            }

            // -------------------------------------------------
            // Create temporary workspace
            // -------------------------------------------------

            tempDirectory =
                    Files.createTempDirectory(
                            "mentora-java-"
                    );

            Path javaFile =
                    tempDirectory.resolve(
                            "Main.java"
                    );

            // -------------------------------------------------
            // Save generated program
            // -------------------------------------------------

            Files.writeString(
                    javaFile,
                    executableCode,
                    StandardCharsets.UTF_8
            );

            // -------------------------------------------------
            // Docker command
            // -------------------------------------------------

            List<String> command =
                    new ArrayList<>();

            command.add("docker");
            command.add("run");

            // Automatically remove container
            command.add("--rm");

            // -------------------------------------------------
            // Security restrictions
            // -------------------------------------------------

            command.add("--memory");
            command.add("256m");

            command.add("--memory-swap");
            command.add("256m");

            command.add("--cpus");
            command.add("0.5");

            command.add("--pids-limit");
            command.add("64");

            command.add("--network");
            command.add("none");

            command.add("--cap-drop");
            command.add("ALL");

            command.add("--security-opt");
            command.add("no-new-privileges:true");

            // -------------------------------------------------
            // Read-only container
            // -------------------------------------------------

            command.add("--read-only");

            command.add("--tmpfs");

            command.add(
                    "/tmp:rw,noexec,nosuid,size=64m"
            );

            // -------------------------------------------------
            // Mount temporary workspace
            // -------------------------------------------------

            command.add("-v");

            command.add(
                    tempDirectory
                            .toAbsolutePath()
                            .toString()
                            + ":/workspace:rw"
            );

            // -------------------------------------------------
            // Java image
            // -------------------------------------------------

            command.add(JAVA_IMAGE);

            // -------------------------------------------------
            // Container command
            // -------------------------------------------------

            command.add("sh");
            command.add("-c");

            String shellCommand =
                    "cd /workspace && " +
                            "javac Main.java && " +
                            "java Main";

            command.add(shellCommand);

            // -------------------------------------------------
            // Start Docker
            // -------------------------------------------------

            ProcessBuilder processBuilder =
                    new ProcessBuilder(command);

            processBuilder.redirectErrorStream(false);

            Process process =
                    processBuilder.start();

            // -------------------------------------------------
            // Optional input
            // -------------------------------------------------

            String input =
                    request.getInput();

            if (input != null
                    && !input.isEmpty()) {

                process.getOutputStream()
                        .write(
                                input.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        );
            }

            process.getOutputStream().close();

            // -------------------------------------------------
            // Capture output
            // -------------------------------------------------

            StreamReader outputReader =
                    new StreamReader(
                            process.getInputStream()
                    );

            StreamReader errorReader =
                    new StreamReader(
                            process.getErrorStream()
                    );

            Thread outputThread =
                    new Thread(outputReader);

            Thread errorThread =
                    new Thread(errorReader);

            outputThread.start();
            errorThread.start();

            // -------------------------------------------------
            // Wait for execution
            // -------------------------------------------------

            boolean finished =
                    process.waitFor(
                            TIMEOUT_SECONDS,
                            TimeUnit.SECONDS
                    );

            // -------------------------------------------------
            // Timeout
            // -------------------------------------------------

            if (!finished) {

                process.destroyForcibly();

                outputThread.join(1000);
                errorThread.join(1000);

                return response(
                        false,
                        outputReader.getResult(),
                        "Time Limit Exceeded: "
                                + "Program execution exceeded "
                                + TIMEOUT_SECONDS
                                + " seconds.",
                        System.currentTimeMillis()
                                - startTime
                );
            }

            // -------------------------------------------------
            // Wait for output readers
            // -------------------------------------------------

            outputThread.join(1000);
            errorThread.join(1000);

            String output =
                    outputReader.getResult();

            String error =
                    errorReader.getResult();

            long executionTime =
                    System.currentTimeMillis()
                            - startTime;

            int exitCode =
                    process.exitValue();

            // -------------------------------------------------
            // Successful execution
            // -------------------------------------------------

            if (exitCode == 0) {

                return response(
                        true,
                        output,
                        "",
                        executionTime
                );
            }

            // -------------------------------------------------
            // Compilation / runtime error
            // -------------------------------------------------

            if (error == null
                    || error.isBlank()) {

                error =
                        "Program exited with code "
                                + exitCode;
            }

            return response(
                    false,
                    output,
                    error,
                    executionTime
            );

        } catch (Exception e) {

            return response(
                    false,
                    "",
                    "Execution failed: "
                            + e.getMessage(),
                    System.currentTimeMillis()
                            - startTime
            );

        } finally {

            // -------------------------------------------------
            // Delete temporary directory
            // -------------------------------------------------

            deleteDirectory(
                    tempDirectory
            );
        }
    }


    // =========================================================
    // BUILD JAVA PROGRAM
    // =========================================================

    private String buildJavaProgram(
            CodeExecutionRequest request
    ) {

        Long problemId =
                request.getProblemId();

        // -----------------------------------------------------
        // TWO SUM
        // problemId = 1
        // -----------------------------------------------------

        if (problemId == 1L) {

            return buildTwoSumProgram(
                    request.getCode()
            );
        }

        return null;
    }


    // =========================================================
    // TWO SUM EXECUTION WRAPPER
    // =========================================================

    private String buildTwoSumProgram(
            String studentCode
    ) {

        return """
                import java.util.*;

                %s

                public class Main {

                    public static void main(String[] args) {

                        Solution solution =
                                new Solution();

                        // =========================================
                        // TEST CASE 1
                        // nums = [2, 7, 11, 15]
                        // target = 9
                        // expected = [0, 1]
                        // =========================================

                        int[] nums1 =
                                {2, 7, 11, 15};

                        int target1 = 9;

                        int[] result1 =
                                solution.twoSum(
                                        nums1,
                                        target1
                                );

                        int[] expected1 =
                                {0, 1};

                        System.out.println(
                                "Test Case 1:"
                        );

                        System.out.println(
                                "Input: nums = [2, 7, 11, 15], target = 9"
                        );

                        System.out.println(
                                "Expected: "
                                        + Arrays.toString(expected1)
                        );

                        System.out.println(
                                "Actual:   "
                                        + Arrays.toString(result1)
                        );

                        System.out.println(
                                "Result:   "
                                        + (
                                        Arrays.equals(
                                                result1,
                                                expected1
                                        )
                                                ? "PASSED"
                                                : "FAILED"
                                )
                        );

                        System.out.println();

                        // =========================================
                        // TEST CASE 2
                        // nums = [3, 2, 4]
                        // target = 6
                        // expected = [1, 2]
                        // =========================================

                        int[] nums2 =
                                {3, 2, 4};

                        int target2 = 6;

                        int[] result2 =
                                solution.twoSum(
                                        nums2,
                                        target2
                                );

                        int[] expected2 =
                                {1, 2};

                        System.out.println(
                                "Test Case 2:"
                        );

                        System.out.println(
                                "Input: nums = [3, 2, 4], target = 6"
                        );

                        System.out.println(
                                "Expected: "
                                        + Arrays.toString(expected2)
                        );

                        System.out.println(
                                "Actual:   "
                                        + Arrays.toString(result2)
                        );

                        System.out.println(
                                "Result:   "
                                        + (
                                        Arrays.equals(
                                                result2,
                                                expected2
                                        )
                                                ? "PASSED"
                                                : "FAILED"
                                )
                        );
                    }
                }
                """.formatted(studentCode);
    }


    // =========================================================
    // STREAM READER
    // =========================================================

    private static class StreamReader
            implements Runnable {

        private final InputStream inputStream;

        private final StringBuilder result =
                new StringBuilder();

        StreamReader(
                InputStream inputStream
        ) {
            this.inputStream = inputStream;
        }

        @Override
        public void run() {

            try (
                    BufferedReader reader =
                            new BufferedReader(
                                    new InputStreamReader(
                                            inputStream,
                                            StandardCharsets.UTF_8
                                    )
                            )
            ) {

                String line;

                while (
                        (line = reader.readLine())
                                != null
                ) {

                    result.append(line)
                            .append(
                                    System.lineSeparator()
                            );
                }

            } catch (Exception e) {

                result.append(
                        "Error reading process output: "
                ).append(
                        e.getMessage()
                );
            }
        }

        String getResult() {
            return result.toString();
        }
    }


    // =========================================================
    // DELETE TEMPORARY DIRECTORY
    // =========================================================

    private void deleteDirectory(
            Path directory
    ) {

        if (directory == null) {
            return;
        }

        try {

            if (Files.exists(directory)) {

                Files.walk(directory)
                        .sorted(
                                Comparator.reverseOrder()
                        )
                        .forEach(path -> {

                            try {

                                Files.deleteIfExists(
                                        path
                                );

                            } catch (Exception ignored) {
                                // Ignore cleanup errors
                            }
                        });
            }

        } catch (Exception ignored) {
            // Ignore cleanup errors
        }
    }


    // =========================================================
    // EXECUTION RESPONSE HELPER
    // =========================================================

    private CodeExecutionResponse response(
            boolean success,
            String output,
            String error,
            long executionTime
    ) {

        return new CodeExecutionResponse(
                success,
                output,
                error,
                executionTime
        );
    }


    // =========================================================
    // SIMULATION RESPONSE HELPER
    // =========================================================

    private CodeSimulationResponse simulationResponse(
            boolean success,
            String language,
            String problem,
            String error,
            long executionTime,
            List<CodeSimulationStep> trace
    ) {

        return new CodeSimulationResponse(
                success,
                language,
                problem,
                error,
                executionTime,
                trace
        );
    }
}