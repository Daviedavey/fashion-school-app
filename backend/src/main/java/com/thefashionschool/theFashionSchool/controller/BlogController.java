package com.thefashionschool.theFashionSchool.controller;

import org.springframework.security.core.Authentication;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import com.thefashionschool.theFashionSchool.dto.BlogPostDTO;
import com.thefashionschool.theFashionSchool.model.BlogPost;
import com.thefashionschool.theFashionSchool.security.JwtUtils;
import com.thefashionschool.theFashionSchool.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
public class BlogController {


    @Autowired  // Ensure this is present
    private JwtUtils jwtUtils;

    @Autowired
    private BlogPostService blogPostService;

    private JwtUtils JwtUtils;
    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost( //Wild card for multiple response types
            @RequestPart("text") String text,
            @RequestPart("image") MultipartFile image,
            @RequestHeader("Authorization") String authHeader) {

        logger.info("Auth Header: {}", authHeader);
        logger.info("File received: {} ({} bytes)",
                image.getOriginalFilename(),
                image.getSize());

        if (image.isEmpty() || image.getSize() == 0) {
            logger.warn("Upload attempt with an empty file.");
            return ResponseEntity.badRequest().body("Image file cannot be empty.");
        }

        logger.info("File received: {} ({} bytes)", image.getOriginalFilename(), image.getSize());

        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            if (!jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT Token");
            }
            String username = jwtUtils.getUserNameFromJwtToken(token);

            BlogPost post = blogPostService.createPost(username, text, image);
            BlogPostDTO postDto = blogPostService.convertToDto(post);

            return ResponseEntity.status(HttpStatus.CREATED).body(postDto);

        } catch (RuntimeException e) {
            // This will now catch the "Failed to store file" exception from the service
            logger.error("Failed to create post due to a storage error.", e); // LOG THE FULL STACK TRACE
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to store image file.");
        } catch (Exception e) {
            // Catch any other unexpected errors
            logger.error("An unexpected error occurred during post creation.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping
    public ResponseEntity<List<BlogPostDTO>> getAllPosts() {
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
        // The Authentication principal is automatically injected by Spring Security.
        // It contains the details of the currently logged-in user.
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        String currentUsername = authentication.getName();

        try {
            blogPostService.deletePost(id, currentUsername);
            // A successful DELETE can return 204 No Content, but 200 OK with a message is often
            // easier for frontends to handle.
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully."));

        } catch (EntityNotFoundException e) {
            // This exception comes from our service if the post ID doesn't exist.
            logger.warn("Attempt to delete non-existent post with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (AccessDeniedException e) {
            // This exception comes from our service if the user is not the owner.
            logger.warn("Unauthorized delete attempt on post {} by user {}", id, currentUsername);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());

        } catch (Exception e) {
            // A general catch-all for any other unexpected errors.
            logger.error("Error deleting post with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred.");
        }
    }


}