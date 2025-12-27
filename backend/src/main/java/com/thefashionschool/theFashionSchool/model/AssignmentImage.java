package com.thefashionschool.theFashionSchool.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "assignment_images")
public class AssignmentImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The path to the image file, e.g., "abc-123.jpg"
    @Column(nullable = false)
    private String imagePath;

    // This creates the link back to the Assignment
    // Many images can belong to one assignment.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    @JsonBackReference // Prevents infinite loops during JSON serialization
    private Assignment assignment;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }
}