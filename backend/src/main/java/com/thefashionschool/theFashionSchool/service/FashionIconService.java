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


    @Autowired
    private FashionIconRepository fashionIconRepository;

    @Autowired
    private S3Service s3Service;


    public Optional<FashionIcon> getCurrentFashionIcon() {
        return fashionIconRepository.findTopByOrderByUpdatedAtDesc();
    }

    public FashionIcon createOrUpdateFashionIcon(String name, String description, MultipartFile image) throws IOException {
      //upload to S3
        String s3Url = s3Service.uploadFile(image);


        FashionIcon fashionIcon = new FashionIcon();
        fashionIcon.setName(name);
        fashionIcon.setDescription(description);
        fashionIcon.setImagePath(s3Url);
        fashionIcon.setUpdatedAt(LocalDateTime.now());

        return fashionIconRepository.save(fashionIcon);
    }
}