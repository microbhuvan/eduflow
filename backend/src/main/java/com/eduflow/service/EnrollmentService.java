package com.eduflow.service;

import com.eduflow.dto.CourseDto;
import com.eduflow.dto.EnrollmentDto;
import com.eduflow.dto.EnrollmentRequest;
import com.eduflow.exception.BadRequestException;
import com.eduflow.exception.ResourceNotFoundException;
import com.eduflow.model.Enrollment;
import com.eduflow.model.Role;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.repository.UserRepository;
import com.eduflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentDto create(EnrollmentRequest request) {
        var student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Enrollment requires STUDENT role");
        }
        var course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("Student already enrolled in this course");
        }
        Enrollment enrollment = enrollmentRepository.save(Enrollment.builder()
                .student(student)
                .course(course)
                .build());
        return toDto(enrollment);
    }

    public List<EnrollmentDto> findAll(UserPrincipal principal) {
        if (principal.getRole() == Role.ADMIN) {
            return enrollmentRepository.findAll().stream().map(this::toDto).toList();
        }
        return enrollmentRepository.findByStudentId(principal.getId()).stream().map(this::toDto).toList();
    }

    public void delete(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found");
        }
        enrollmentRepository.deleteById(id);
    }

    public List<CourseDto> findCoursesByUserId(Long userId, UserPrincipal principal) {
        if (principal.getRole() == Role.STUDENT && !principal.getId().equals(userId)) {
            throw new BadRequestException("Students can only view their own courses");
        }
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return enrollmentRepository.findByStudentId(userId).stream()
                .map(e -> {
                    var c = e.getCourse();
                    return CourseDto.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .description(c.getDescription())
                            .courseCode(c.getCourseCode())
                            .credits(c.getCredits())
                            .syllabus(c.getSyllabus())
                            .learningOutcomes(c.getLearningOutcomes())
                            .build();
                })
                .toList();
    }

    private EnrollmentDto toDto(Enrollment enrollment) {
        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getName())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .build();
    }
}
