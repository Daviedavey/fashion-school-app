package com.thefashionschool.theFashionSchool.config;

import com.thefashionschool.theFashionSchool.model.Level;
import com.thefashionschool.theFashionSchool.model.StudentGroup;
import com.thefashionschool.theFashionSchool.repository.StudentGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StudentGroupRepository groupRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only run this if the table is empty
        if (groupRepository.count() == 0) {
            System.out.println("No student groups found. Initializing default groups...");

            StudentGroup group1 = new StudentGroup();
            group1.setName("Tuesday (16:00 - 17:30)");
            group1.setAccessibleLevels(Set.of(Level.BEGINNER, Level.ADVANCED));

            StudentGroup group2 = new StudentGroup();
            group2.setName("Tuesday (18:30 - 20:00)");
            group2.setAccessibleLevels(Set.of(Level.BEGINNER, Level.ADVANCED));

            StudentGroup group3 = new StudentGroup();
            group3.setName("Wednesday (10:30 - 12:00)");
            group3.setAccessibleLevels(Set.of(Level.BEGINNER, Level.ADVANCED));

            StudentGroup group4 = new StudentGroup();
            group4.setName("Wednesday (14:30 - 16:00)");
            group4.setAccessibleLevels(Set.of(Level.BEGINNER));

            StudentGroup group5 = new StudentGroup();
            group5.setName("Wednesday (16:00 - 17:30)");
            group5.setAccessibleLevels(Set.of(Level.BEGINNER, Level.ADVANCED));

            StudentGroup group6 = new StudentGroup();
            group6.setName("Wednesday (18:30 - 20:00)");
            group6.setAccessibleLevels(Set.of(Level.BEGINNER, Level.ADVANCED, Level.EXPERT));

            groupRepository.saveAll(List.of(group1, group2, group3, group4, group5, group6));

            System.out.println("Initialized " + groupRepository.count() + " student groups.");
        } else {
            System.out.println("Student groups already exist. Skipping initialization.");
        }
    }
}