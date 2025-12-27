// src/main/java/.../service/FashionIconService.java
package com.thefashionschool.theFashionSchool.service;

import com.thefashionschool.theFashionSchool.model.FashionIcon;
import com.thefashionschool.theFashionSchool.repository.FashionIconRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class FashionIconService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private FashionIconRepository fashionIconRepository;

    public Optional<FashionIcon> getCurrentFashionIcon() {
        return fashionIconRepository.findTopByOrderByUpdatedAtDesc();
    }

    public FashionIcon createOrUpdateFashionIcon(String name, String description, MultipartFile image) throws IOException {
        // Since there's only one, we can either update the existing one or create a new one.
        // For simplicity, we'll create a new one each time and rely on the query to get the latest.

        // File storage logic
        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FashionIcon fashionIcon = new FashionIcon();
        fashionIcon.setName(name);
        fashionIcon.setDescription(description);
        fashionIcon.setImagePath(filename);
        fashionIcon.setUpdatedAt(LocalDateTime.now());

        return fashionIconRepository.save(fashionIcon);
    }
}