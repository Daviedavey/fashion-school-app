package com.thefashionschool.theFashionSchool.service;

import com.thefashionschool.theFashionSchool.model.Role;
import com.thefashionschool.theFashionSchool.model.User;
import com.thefashionschool.theFashionSchool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public boolean isTeacher(String username) {
        User user = userRepository.findByUsername(username);
        return user != null && user.getRole() == Role.TEACHER;
    }
}