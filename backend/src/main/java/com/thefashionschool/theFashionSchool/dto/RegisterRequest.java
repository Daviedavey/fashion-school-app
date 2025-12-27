package com.thefashionschool.theFashionSchool.dto;

import com.thefashionschool.theFashionSchool.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 2, max = 20)
    private String name;

    @NotBlank
    @Size(min = 2, max = 20)
    private String surname;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    @ValidPassword
    private String password;

    @NotNull(message = "You must select your Class-Group")
    private Long groupId;


    public @NotNull Long getGroupId() {
        return groupId;
    }
}