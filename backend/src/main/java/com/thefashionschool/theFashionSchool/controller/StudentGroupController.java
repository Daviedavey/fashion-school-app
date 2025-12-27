package com.thefashionschool.theFashionSchool.controller;

import com.thefashionschool.theFashionSchool.model.StudentGroup;
import com.thefashionschool.theFashionSchool.repository.StudentGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class StudentGroupController {

    @Autowired
    private StudentGroupRepository studentGroupRepository;

    // Public endpoint to get all available groups
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllGroups() {
        // We only want to send the ID and name to the frontend, not the whole entity
        List<Map<String, Object>> groups = studentGroupRepository.findAll().stream()
                .map(group -> Map.of(
                        "id", (Object) group.getId(),
                        "name", (Object)  group.getName()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(groups);
    }
}