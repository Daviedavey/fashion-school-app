// src/main/java/.../controller/FashionIconController.java
package com.thefashionschool.theFashionSchool.controller;

import com.thefashionschool.theFashionSchool.model.FashionIcon;
import com.thefashionschool.theFashionSchool.service.FashionIconService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/fashion-icon")
public class FashionIconController {

    @Autowired
    private FashionIconService fashionIconService;

    // Endpoint for students to get the current icon
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentFashionIcon() {
        return fashionIconService.getCurrentFashionIcon()
                .map(icon -> {
                    String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/api/images/")
                            .path(icon.getImagePath())
                            .toUriString();
                    // Return a map or a DTO
                    return ResponseEntity.ok(Map.of(
                            "name", icon.getName(),
                            "description", icon.getDescription(),
                            "imageUrl", imageUrl
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint for teachers to upload/update the icon
    @PostMapping
    public ResponseEntity<?> createOrUpdateFashionIcon(
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("image") MultipartFile image
    ) {
        try {
            fashionIconService.createOrUpdateFashionIcon(name, description, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Fashion Icon updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to update Fashion Icon."));
        }
    }
}