package com.thefashionschool.theFashionSchool.controller;

import com.thefashionschool.theFashionSchool.dto.AssignmentDTO;
import com.thefashionschool.theFashionSchool.model.Assignment;
import com.thefashionschool.theFashionSchool.model.Level;
import com.thefashionschool.theFashionSchool.service.AssignmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private AssignmentService assignmentService;

    // Endpoint for Teachers to create an assignment
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createAssignment(
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("level") String levelStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication
    ) {
        String username = authentication.getName();
        try {
            Level level = Level.valueOf(levelStr.toUpperCase());
            Assignment assignment = assignmentService.createAssignment(title, description, username, level, images);
            AssignmentDTO dto = assignmentService.convertToDto(assignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            logger.error("Error creating assignment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create assignment: " + e.getMessage()));
        }
    }

    // Endpoint for Students (and Teachers) to get all assignments
    @GetMapping
    public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAssignmentsForCurrentUser());
    }


}