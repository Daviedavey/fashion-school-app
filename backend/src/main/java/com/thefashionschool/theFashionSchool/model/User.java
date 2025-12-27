package com.thefashionschool.theFashionSchool.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role; // STUDENT, TEACHER, ADMIN

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_group_id") // This will be a foreign key column in the 'users' table
    private StudentGroup studentGroup;


    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }

    public void setSurname(String surname) { this.surname = surname; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public StudentGroup getStudentGroup() { return studentGroup; }
    public void setStudentGroup(StudentGroup studentGroup) { this.studentGroup = studentGroup; }
}
