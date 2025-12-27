package com.thefashionschool.theFashionSchool.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// src/main/java/com/yourapp/controller/TeacherController.java
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @PostMapping("/upload-assignment")
    @PreAuthorize("@userService.isTeacher(authentication.principal.username)")
    public ResponseEntity<String> uploadAssignment() {
        // Teacher-only logic
        return ResponseEntity.ok("Assignment uploaded");
    }
}