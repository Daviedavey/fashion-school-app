 package com.thefashionschool.theFashionSchool.service;

import com.thefashionschool.theFashionSchool.dto.RegisterRequest;
import com.thefashionschool.theFashionSchool.dto.RegisterResponse;
import com.thefashionschool.theFashionSchool.model.Role;
import com.thefashionschool.theFashionSchool.model.StudentGroup;
import com.thefashionschool.theFashionSchool.model.User;
import com.thefashionschool.theFashionSchool.repository.StudentGroupRepository;
import com.thefashionschool.theFashionSchool.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final StudentGroupRepository studentGroupRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, StudentGroupRepository studentGroupRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentGroupRepository = studentGroupRepository;
    }

    public RegisterResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new RegisterResponse("Username is already taken!", false);
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new RegisterResponse("Email is already in use!", false);
        }

        StudentGroup group = studentGroupRepository.findById(registerRequest.getGroupId())
                .orElseThrow(() -> new EntityNotFoundException("Student group not found with ID: " + registerRequest.getGroupId()));

        // Create new user account
        User user = new User();
        user.setUsername(registerRequest.getUsername().toLowerCase());
        user.setName(registerRequest.getName().toLowerCase());
        user.setSurname(registerRequest.getSurname().toLowerCase());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.STUDENT); // Default role
        user.setStudentGroup(group);

        userRepository.save(user);

        return new RegisterResponse("User registered successfully!", true);
    }
}