 package com.thefashionschool.theFashionSchool.service;

import com.thefashionschool.theFashionSchool.dto.RegisterRequest;
import com.thefashionschool.theFashionSchool.dto.RegisterResponse;
import com.thefashionschool.theFashionSchool.model.Role;
import com.thefashionschool.theFashionSchool.model.StudentGroup;
import com.thefashionschool.theFashionSchool.model.User;
import com.thefashionschool.theFashionSchool.repository.StudentGroupRepository;
import com.thefashionschool.theFashionSchool.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

 @Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentGroupRepository studentGroupRepository;

    @Value("${app.teacher.secret-code}")
    private String teacherSecretCode;

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

        // Create new user account
        User user = new User();
        user.setUsername(registerRequest.getUsername().toLowerCase());
        user.setName(registerRequest.getName().toLowerCase());
        user.setSurname(registerRequest.getSurname().toLowerCase());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
       // user.setRole(Role.STUDENT); // Default role


        if(StringUtils.hasText(registerRequest.getTeacherCode()))
        {
            // User provided a teacher passcode -> Validate it
            if(!registerRequest.getTeacherCode().equals(teacherSecretCode))
            {
                return new RegisterResponse("Invalid Teacher Access Code!", false);
            }
            user.setRole(Role.TEACHER);
            user.setStudentGroup(null);
        }else{
            // No teacher code -> Standard Student Registration
            if(registerRequest.getGroupId() == null){
                return new RegisterResponse("Students must select a group!", false);
            }
            StudentGroup group = studentGroupRepository.findById(registerRequest.getGroupId())
                    .orElseThrow(() -> new EntityNotFoundException("Student group not found with ID: " + registerRequest.getGroupId()));

            user.setRole(Role.STUDENT);
            user.setStudentGroup(group);
        }


        userRepository.save(user);
        return new RegisterResponse("User registered successfully!", true);
    }
}