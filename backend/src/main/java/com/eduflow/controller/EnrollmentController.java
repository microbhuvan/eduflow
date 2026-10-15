package com.eduflow.controller;

import com.eduflow.dto.EnrollmentDto;
import com.eduflow.dto.EnrollmentRequest;
import com.eduflow.security.UserPrincipal;
import com.eduflow.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentDto> createEnrollment(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentDto>> getEnrollments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(enrollmentService.findAll(principal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
