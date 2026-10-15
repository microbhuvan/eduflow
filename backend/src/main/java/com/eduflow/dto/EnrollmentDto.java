package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnrollmentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseTitle;
}
