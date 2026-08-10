package com.mentora.backend.controller;

import com.mentora.backend.entity.User;
import com.mentora.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    public static final String GOOGLE_AUTH_FLOW_SESSION_KEY = "google_auth_flow";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================================================
    // GOOGLE LOGIN
    // =========================================================

    @GetMapping("/google/login")
    public void googleLogin(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        request.getSession(true).setAttribute(
                GOOGLE_AUTH_FLOW_SESSION_KEY,
                "login"
        );

        response.sendRedirect("/oauth2/authorization/google");
    }

    // =========================================================
    // GOOGLE SIGNUP
    // =========================================================

    @GetMapping("/google/signup")
    public void googleSignup(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        request.getSession(true).setAttribute(
                GOOGLE_AUTH_FLOW_SESSION_KEY,
                "signup"
        );

        response.sendRedirect("/oauth2/authorization/google");
    }

    // =========================================================
    // NORMAL SIGNUP
    // =========================================================

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest request
    ) {

        try {

            User user = authService.signup(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // NORMAL LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        try {

            User user = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity
                    .ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // SIGNUP REQUEST
    // =========================================================

    public static class SignupRequest {

        private String name;
        private String email;
        private String password;

        public SignupRequest() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // =========================================================
    // LOGIN REQUEST
    // =========================================================

    public static class LoginRequest {

        private String email;
        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}