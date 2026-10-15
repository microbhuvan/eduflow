package com.eduflow.dto;

import java.time.Instant;
import java.util.List;

public final class PortalDtos {
    private PortalDtos() {
    }

    public record CourseSummary(Long id, String code, String title, String description, boolean enrolled) {
    }

    public record LessonView(Long id, String title, String notes, boolean hasPdf, int sortOrder) {
    }

    public record CourseDetail(
            Long id,
            String code,
            String title,
            String description,
            boolean enrolled,
            List<LessonView> lessons
    ) {
    }

    public record EnrollmentView(Long id, Long courseId, String code, String title, Instant enrolledAt) {
    }

    public record NoticeView(Long id, String title, String message, Instant createdAt) {
    }

    public record QuestionRequest(
            @jakarta.validation.constraints.NotBlank(message = "Subject is required.") String subject,
            @jakarta.validation.constraints.NotBlank(message = "Write your question.") String message
    ) {
    }

    public record QuestionView(
            Long id,
            String subject,
            String message,
            String reply,
            Instant createdAt,
            Instant repliedAt
    ) {
    }
}
