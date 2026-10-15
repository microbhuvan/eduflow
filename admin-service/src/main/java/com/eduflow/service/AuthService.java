package com.eduflow.service;

import com.eduflow.dto.AdminDtos.AuthResponse;
import com.eduflow.dto.AdminDtos.LoginRequest;
import com.eduflow.dto.AdminDtos.ProfileView;
import com.eduflow.exception.ApiException;
import com.eduflow.model.Role;
import com.eduflow.model.User;
import com.eduflow.repository.UserRepository;
import com.eduflow.security.CurrentUser;
import com.eduflow.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CurrentUser currentUser;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CurrentUser currentUser
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.currentUser = currentUser;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (AuthenticationException exception) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This portal is for staff. Students use the student site.");
        }
        String token = jwtService.createToken(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public ProfileView profile() {
        User user = currentUser.get();
        return new ProfileView(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
