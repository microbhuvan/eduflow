package com.eduflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank(message = "Name is required.") String name,
            @Email(message = "Enter a valid email.") @NotBlank(message = "Email is required.") String email,
            @Size(min = 8, message = "Password must be at least 8 characters.") String password
    ) {
    }

    public record LoginRequest(
            @Email(message = "Enter a valid email.") @NotBlank(message = "Email is required.") String email,
            @NotBlank(message = "Password is required.") String password
    ) {
    }

    public record AuthResponse(String token, Long userId, String name, String email, String role) {
    }

    public record ProfileView(Long id, String name, String email, String role) {
    }

    public record NameRequest(@NotBlank(message = "Name is required.") String name) {
    }
}
