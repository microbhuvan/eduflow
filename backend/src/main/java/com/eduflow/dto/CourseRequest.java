package com.eduflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseRequest {
    @NotBlank
    private String title;
    private String description;
    private String courseCode;
    private Integer credits;
    private String syllabus;
    private String learningOutcomes;
}
