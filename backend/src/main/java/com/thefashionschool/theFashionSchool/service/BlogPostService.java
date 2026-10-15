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

    @Autowired
    private S3Service s3Service; // Injects s3 Service

    public BlogPost createPost(String username, String text, MultipartFile image) {

        // upload image straight to AWS S3
          String s3Url = s3Service.uploadFile(image);

            // Create and save blog post
            BlogPost post = new BlogPost();
            post.setUsername(username);
            post.setText(text);
            post.setImagePath(s3Url);
            post.setCreatedAt(LocalDateTime.now());

            return blogPostRepository.save(post);
    }

    public void deletePost(Long postId, String currentUsername) {
        // Post finden
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Blog post with ID " + postId + " not found."));

        // 2. SECURITY CHECK: Verify that the user attempting the delete is the owner of the post.
        if (!post.getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("You are not authorized to delete this post.");
        }

        // 4. Delete the post from the database.
        blogPostRepository.deleteById(postId);
        logger.info("Successfully deleted blog post record with ID: {}", postId);

        //Delete image from AWS S3
       s3Service.deleteFile(post.getImagePath());
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
                post.getImagePath(), // contains the cloud URL
                post.getCreatedAt()
        );
    }
}