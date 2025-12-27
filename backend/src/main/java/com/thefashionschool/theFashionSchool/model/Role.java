package com.thefashionschool.theFashionSchool.model;

public enum Role {
    TEACHER,
    STUDENT;

    // Convert to Spring Security format
    public String toAuthority() {
        return "ROLE_" + this.name();
    }
}
