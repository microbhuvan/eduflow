package com.eduflow.service;

import com.eduflow.dto.AuthDtos.AuthResponse;
import com.eduflow.dto.AuthDtos.LoginRequest;
import com.eduflow.dto.AuthDtos.NameRequest;
import com.eduflow.dto.AuthDtos.ProfileView;
import com.eduflow.dto.AuthDtos.RegisterRequest;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CurrentUser currentUser;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CurrentUser currentUser
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.currentUser = currentUser;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "An account with this email already exists.");
        }
        User student = userRepository.save(new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                Role.STUDENT
        ));
        return tokenFor(student);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );
        } catch (AuthenticationException exception) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (user.getRole() != Role.STUDENT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This portal is for students. Staff use the admin site.");
        }
        return tokenFor(user);
    }

    public ProfileView profile() {
        User user = currentUser.get();
        return new ProfileView(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public ProfileView rename(NameRequest request) {
        User user = userRepository.findById(currentUser.get().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in."));
        user.setName(request.name().trim());
        userRepository.save(user);
        return new ProfileView(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    private AuthResponse tokenFor(User user) {
        String token = jwtService.createToken(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
