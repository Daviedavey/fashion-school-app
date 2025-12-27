package com.thefashionschool.theFashionSchool.model;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "student_groups")
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Tuesday (16:00 - 17:30)"

    // This defines the list of levels this group can access.
    // E.g., a group can have {BEGINNER, ADVANCED}
    @ElementCollection(targetClass = Level.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "group_levels", joinColumns = @JoinColumn(name = "group_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private Set<Level> accessibleLevels;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Set<Level> getAccessibleLevels() { return accessibleLevels; }
    public void setAccessibleLevels(Set<Level> accessibleLevels) { this.accessibleLevels = accessibleLevels; }
}