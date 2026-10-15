package com.eduflow.dto;

import com.eduflow.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    private String password;
    @NotNull
    private Role role;
}
