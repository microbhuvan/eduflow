package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CourseAnnouncementDto {
    private Long id;
    private String title;
    private String message;
    private Instant createdAt;
}
