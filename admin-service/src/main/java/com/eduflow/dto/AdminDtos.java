package com.eduflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public final class AdminDtos {
    private AdminDtos() {
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

    public record StudentRequest(
            @NotBlank(message = "Name is required.") String name,
            @Email(message = "Enter a valid email.") @NotBlank(message = "Email is required.") String email,
            @Size(min = 8, message = "Password must be at least 8 characters.") String password
    ) {
    }

    public record StudentView(Long id, String name, String email) {
    }

    public record CourseRequest(
            @NotBlank(message = "Course code is required.") String code,
            @NotBlank(message = "Title is required.") String title,
            @NotBlank(message = "Description is required.") String description
    ) {
    }

    public record LessonRequest(
            @NotBlank(message = "Lesson title is required.") String title,
            @NotBlank(message = "Write the class notes.") String notes
    ) {
    }

    public record LessonView(Long id, String title, String notes, boolean hasPdf, int sortOrder) {
    }

    public record CourseView(Long id, String code, String title, String description, int lessonCount) {
    }

    public record CourseDetail(Long id, String code, String title, String description, List<LessonView> lessons) {
    }

    public record EnrollmentView(Long id, String studentName, String studentEmail, String courseCode, String courseTitle, Instant enrolledAt) {
    }

    public record NoticeRequest(
            @NotBlank(message = "Title is required.") String title,
            @NotBlank(message = "Write the notice.") String message
    ) {
    }

    public record NoticeView(Long id, String title, String message, Instant createdAt) {
    }

    public record QuestionView(
            Long id,
            String studentName,
            String studentEmail,
            String subject,
            String message,
            String reply,
            Instant createdAt,
            Instant repliedAt
    ) {
    }

    public record ReplyRequest(@NotBlank(message = "Write a reply.") String reply) {
    }

    public record DashboardView(long students, long courses, long enrollments, long openQuestions) {
    }
}
