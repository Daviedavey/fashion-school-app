package com.thefashionschool.theFashionSchool.service;

import com.thefashionschool.theFashionSchool.dto.AssignmentDTO;
import com.thefashionschool.theFashionSchool.model.*;
import com.thefashionschool.theFashionSchool.repository.AssignmentRepository;
import com.thefashionschool.theFashionSchool.repository.UserRepository;
import com.thefashionschool.theFashionSchool.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Value("${file.upload-dir}")
    private String assignmentUploadDir;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @Transactional // Use transactions for operations involving multiple saves
    public Assignment createAssignment(String title, String description, String username, Level level, List<MultipartFile> files) {

        Assignment assignment = new Assignment();
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setCreatedBy(username);
        assignment.setLevel(level);

        // --- File Upload Logic for multiple files ---
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {

                // Upload each image to AWS S3
                String s3Url = s3Service.uploadFile(file);

                    // Create an AssignmentImage entity and link it to the Assignment
                    AssignmentImage assignmentImage = new AssignmentImage();
                    assignmentImage.setImagePath(s3Url);
                    assignment.addImage(assignmentImage); // Use the helper method we created


            }
        }

        return assignmentRepository.save(assignment);
    }

    public List<AssignmentDTO> getAllAssignmentsForTeacher() {
        return assignmentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AssignmentDTO> getAssignmentsForCurrentUser() {
        // Get the currently authenticated user's details
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername());

        // Based on role, fetch the appropriate assignments
        if (currentUser.getRole() == Role.TEACHER) {
            return getAllAssignmentsForTeacher();
        } else {
            // It's a student, get their group's accessible levels
            Set<Level> accessibleLevels = currentUser.getStudentGroup().getAccessibleLevels();

            // If the student has no accessible levels, return an empty list
            if (accessibleLevels == null || accessibleLevels.isEmpty()) {
                return List.of();
            }

            // Use repository method to find matching assignments
            return assignmentRepository.findByLevelInOrderByCreatedAtDesc(accessibleLevels)
                    .stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
    }

    public AssignmentDTO convertToDto(Assignment assignment) {

        // Direct cloud URLs from S3
        List<String> imageUrls = assignment.getImages().stream()
                .map(AssignmentImage::getImagePath)
                .collect(Collectors.toList());


        return new AssignmentDTO(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getCreatedBy(),
                imageUrls
        );
    }
}