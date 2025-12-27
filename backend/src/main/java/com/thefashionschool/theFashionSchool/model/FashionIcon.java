package com.thefashionschool.theFashionSchool.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fashion_icons")
public class FashionIcon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Naomi Campbell"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String imagePath;

    // We'll use this to always find the most recent one
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}