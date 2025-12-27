package com.thefashionschool.theFashionSchool.dto;

import com.thefashionschool.theFashionSchool.model.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private String name;
    private String surname;
    private String email;
    private Role role;

    public LoginResponse(String token, String username, Role role, String name,
                         String surname, String email) {
        this.token = token;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
    }
}