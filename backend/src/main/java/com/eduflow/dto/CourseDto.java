package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String courseCode;
    private Integer credits;
    private String syllabus;
    private String learningOutcomes;
}
