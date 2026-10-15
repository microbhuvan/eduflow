package com.eduflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseAnnouncementRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String message;
}
