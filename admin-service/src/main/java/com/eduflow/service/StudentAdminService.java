package com.eduflow.service;

import com.eduflow.dto.AdminDtos.StudentRequest;
import com.eduflow.dto.AdminDtos.StudentView;
import com.eduflow.exception.ApiException;
import com.eduflow.model.Role;
import com.eduflow.model.User;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.repository.StudentQueryRepository;
import com.eduflow.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentAdminService {
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentQueryRepository queryRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentAdminService(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            StudentQueryRepository queryRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.queryRepository = queryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StudentView> list() {
        return userRepository.findByRoleOrderByNameAsc(Role.STUDENT).stream()
                .map(this::toView)
                .toList();
    }

    public StudentView create(StudentRequest request) {
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
        return toView(student);
    }

    @Transactional
    public void delete(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found."));
        if (student.getRole() != Role.STUDENT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only student accounts can be removed here.");
        }
        enrollmentRepository.deleteByStudentId(studentId);
        queryRepository.deleteByStudentId(studentId);
        userRepository.delete(student);
    }

    private StudentView toView(User user) {
        return new StudentView(user.getId(), user.getName(), user.getEmail());
    }
}
