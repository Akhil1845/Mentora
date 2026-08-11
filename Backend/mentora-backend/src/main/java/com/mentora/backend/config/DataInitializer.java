package com.mentora.backend.config;

import com.mentora.backend.entity.Problem;
import com.mentora.backend.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeProblems(ProblemRepository problemRepository) {

        return args -> {

            // Prevent duplicate insertion every time the backend starts
            if (problemRepository.count() > 0) {
                return;
            }

            LocalDate today = LocalDate.now();

            // =========================
            // ARRAYS - DAY 1
            // =========================

            Problem twoSum = new Problem(
                    "Two Sum",
                    "Given an array of integers and a target value, find two different positions whose values add up to the target.",
                    "Easy",
                    "Arrays",
                    "hash-map, two-pointer",
                    15,
                    today
            );

            Problem bestTimeToBuyAndSellStock = new Problem(
                    "Best Time to Buy and Sell Stock",
                    "Given an array representing stock prices on different days, find the maximum profit that can be achieved by buying once and selling once.",
                    "Easy",
                    "Arrays",
                    "greedy, one-pass",
                    20,
                    today
            );

            Problem containsDuplicate = new Problem(
                    "Contains Duplicate",
                    "Given an integer array, determine whether any value appears more than once.",
                    "Easy",
                    "Arrays",
                    "hash-set",
                    15,
                    today
            );

            Problem maximumSubarray = new Problem(
                    "Maximum Subarray",
                    "Find the contiguous subarray with the largest possible sum.",
                    "Medium",
                    "Arrays",
                    "kadane, dynamic-programming",
                    25,
                    today
            );

            Problem productExceptSelf = new Problem(
                    "Product of Array Except Self",
                    "Return an array where each position contains the product of every element except the element at that position.",
                    "Medium",
                    "Arrays",
                    "prefix-product, suffix-product",
                    30,
                    today
            );

            Problem maximumProductSubarray = new Problem(
                    "Maximum Product Subarray",
                    "Find the contiguous subarray whose elements produce the largest product.",
                    "Medium",
                    "Arrays",
                    "dynamic-programming",
                    30,
                    today
            );

            Problem findMinimumRotated = new Problem(
                    "Find Minimum in Rotated Sorted Array",
                    "Find the minimum element in a sorted array that has been rotated an unknown number of times.",
                    "Medium",
                    "Arrays",
                    "binary-search",
                    25,
                    today
            );

            Problem searchRotated = new Problem(
                    "Search in Rotated Sorted Array",
                    "Search for a target value in a sorted array that has been rotated.",
                    "Medium",
                    "Arrays",
                    "binary-search",
                    30,
                    today
            );

            Problem threeSum = new Problem(
                    "3Sum",
                    "Find all unique groups of three numbers whose sum is zero.",
                    "Medium",
                    "Arrays",
                    "sorting, two-pointer",
                    35,
                    today
            );

            Problem containerWithMostWater = new Problem(
                    "Container With Most Water",
                    "Given heights of vertical lines, find two lines that together hold the maximum amount of water.",
                    "Medium",
                    "Arrays",
                    "two-pointer, greedy",
                    25,
                    today
            );

            problemRepository.save(twoSum);
            problemRepository.save(bestTimeToBuyAndSellStock);
            problemRepository.save(containsDuplicate);
            problemRepository.save(maximumSubarray);
            problemRepository.save(productExceptSelf);
            problemRepository.save(maximumProductSubarray);
            problemRepository.save(findMinimumRotated);
            problemRepository.save(searchRotated);
            problemRepository.save(threeSum);
            problemRepository.save(containerWithMostWater);

            System.out.println("======================================");
            System.out.println("Mentora Practice Problems Initialized");
            System.out.println("10 Array problems added successfully.");
            System.out.println("======================================");
        };
    }
}