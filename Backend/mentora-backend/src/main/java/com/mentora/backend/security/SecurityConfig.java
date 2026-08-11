package com.mentora.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler
    ) {
        this.googleOAuth2SuccessHandler = googleOAuth2SuccessHandler;
    }

    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==========================================
    // SECURITY CONFIGURATION
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ------------------------------------------
                // Disable CSRF for REST APIs
                // ------------------------------------------

                .csrf(csrf -> csrf.disable())

                // ------------------------------------------
                // Enable CORS
                // ------------------------------------------

                .cors(cors -> {})

                // ------------------------------------------
                // Session Management
                // ------------------------------------------

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                // ==========================================
                // AUTHORIZATION
                // ==========================================

                .authorizeHttpRequests(auth -> auth

                        // ----------------------------------
                        // Authentication
                        // ----------------------------------

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // ----------------------------------
                        // Practice / Problems
                        // ----------------------------------

                        .requestMatchers("/api/problems/**")
                        .permitAll()

                        // ----------------------------------
                        // Daily Problems
                        // ----------------------------------

                        .requestMatchers("/api/daily-problems/**")
                        .permitAll()

                        // ----------------------------------
                        // Simulations
                        // ----------------------------------

                        .requestMatchers("/api/simulations/**")
                        .permitAll()

                        // ----------------------------------
                        // Code Execution
                        // ----------------------------------

                        .requestMatchers("/api/code/**")
                        .permitAll()

                        // ----------------------------------
                        // Code Submissions
                        // ----------------------------------

                        .requestMatchers("/api/submissions/**")
                        .permitAll()

                        // ----------------------------------
                        // OAuth2
                        // ----------------------------------

                        .requestMatchers("/oauth2/**")
                        .permitAll()

                        .requestMatchers("/login/**")
                        .permitAll()

                        // ----------------------------------
                        // CORS Preflight
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        // ----------------------------------
                        // Everything else
                        // ----------------------------------

                        .anyRequest()
                        .authenticated()
                )

                // ==========================================
                // GOOGLE OAUTH2 LOGIN
                // ==========================================

                .oauth2Login(oauth2 ->
                        oauth2.successHandler(
                                googleOAuth2SuccessHandler
                        )
                );

        return http.build();
    }
}