package com.thefashionschool.theFashionSchool.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    // 1. Add a logger instance
    private static final Logger log = LoggerFactory.getLogger(ImageController.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(this.uploadDir);
            Path file = uploadPath.resolve(filename);

            // 2. Security Check: Prevent path traversal attacks
            // This ensures the resolved path is still inside the upload directory
            if (!file.normalize().startsWith(uploadPath.normalize())) {
                log.warn("Path traversal attempt: {}", filename);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Resource resource = new UrlResource(file.toUri());

            // 3. The main bug fix: Use && instead of ||
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    // Fallback to a default type if the type cannot be determined
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                // This will now correctly handle 0-byte files, non-existent files, or non-readable files.
                log.warn("Requested image not found or not readable: {}", filename);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("Malformed URL for filename: {}. Error: {}", filename, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (IOException e) {
            // 4. Log other potential IO errors (like determining content type)
            log.error("Could not determine file type or read file for filename: {}. Error: {}", filename, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}