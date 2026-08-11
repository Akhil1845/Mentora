package com.mentora.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MentoraBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                MentoraBackendApplication.class,
                args
        );
    }
}