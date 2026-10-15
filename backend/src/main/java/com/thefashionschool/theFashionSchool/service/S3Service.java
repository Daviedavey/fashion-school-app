package com.thefashionschool.theFashionSchool.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Generate a unique file name and remove spaces
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // 1. Upload to AWS S3
            s3Client.putObject(new PutObjectRequest(bucketName, filename, file.getInputStream(), metadata));

            // 2. Return the public Cloud URL
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    public void deleteFile(String fileUrl) {
        // Only attempt to delete if it's an AWS URL
        if (fileUrl != null && fileUrl.contains(".amazonaws.com/")) {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            try {
                s3Client.deleteObject(bucketName, fileName);
            } catch (Exception e) {
                System.out.println("Failed to delete from S3: " + e.getMessage());
            }
        }
    }
}