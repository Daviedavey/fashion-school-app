package com.thefashionschool.theFashionSchool.service;

import org.springframework.security.access.AccessDeniedException; // For security
import jakarta.persistence.EntityNotFoundException; // For better error handling
import java.nio.file.NoSuchFileException;
import com.thefashionschool.theFashionSchool.controller.ImageController;
import com.thefashionschool.theFashionSchool.dto.BlogPostDTO;
import com.thefashionschool.theFashionSchool.model.BlogPost;
import com.thefashionschool.theFashionSchool.repository.BlogPostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BlogPostService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private BlogPostRepository blogPostRepository;

    public BlogPost createPost(String username, String text, MultipartFile image) {
        Path filePath = null; // Declare here to use in logging
        try {
            // Create upload directory if not exists
            Files.createDirectories(Paths.get(uploadDir));

            // Generate unique filename
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            filePath = Paths.get(uploadDir, filename);

            logger.info("Attempting to save file to absolute path: {}", filePath.toAbsolutePath());

            // Save file
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create and save blog post
            BlogPost post = new BlogPost();
            post.setUsername(username);
            post.setText(text);
            post.setImagePath(filename);
            post.setCreatedAt(LocalDateTime.now());

            return blogPostRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deletePost(Long postId, String currentUsername) {
        // 1. Find the blog post by its ID. If it doesn't exist, throw an exception.
        //    Using orElseThrow is a clean way to handle the "not found" case.
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Blog post with ID " + postId + " not found."));

        // 2. SECURITY CHECK: Verify that the user attempting the delete is the owner of the post.
        if (!post.getUsername().equals(currentUsername)) {
            // If not, throw an AccessDeniedException. This will result in a 403 Forbidden status.
            throw new AccessDeniedException("You are not authorized to delete this post.");
        }

        // 3. Get the path to the image file before we delete the database record.
        String filename = post.getImagePath();
        Path imagePath = Paths.get(uploadDir).resolve(filename);

        // 4. Delete the post from the database.
        blogPostRepository.deleteById(postId);
        logger.info("Successfully deleted blog post record with ID: {}", postId);

        // 5. Delete the associated image file from the file system.
        try {
            Files.deleteIfExists(imagePath);
            logger.info("Successfully deleted associated image file: {}", filename);
        } catch (IOException e) {
            // If the file can't be deleted, we log it as a warning but don't fail the whole operation,
            // as the primary goal (deleting the post record) was successful.
            logger.warn("Could not delete image file: {}. Manual cleanup may be required. Error: {}", filename, e.getMessage());
        }
    }

    public List<BlogPostDTO> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto) // Use the existing convertToDto method for consistency
                .collect(Collectors.toList());
    }

    public BlogPostDTO convertToDto(BlogPost post) {
        return new BlogPostDTO(
                post.getId(),
                post.getUsername(),
                post.getText(),
                post.getImagePath(), // Return accessible URL
                post.getCreatedAt()
        );
    }
}