package com.eduflow.controller;

import com.eduflow.dto.AuthDtos.AuthResponse;
import com.eduflow.dto.AuthDtos.LoginRequest;
import com.eduflow.dto.AuthDtos.NameRequest;
import com.eduflow.dto.AuthDtos.ProfileView;
import com.eduflow.dto.AuthDtos.RegisterRequest;
import com.eduflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public ProfileView me() {
        return authService.profile();
    }

    @PutMapping("/me")
    public ProfileView rename(@Valid @RequestBody NameRequest request) {
        return authService.rename(request);
    }
}
