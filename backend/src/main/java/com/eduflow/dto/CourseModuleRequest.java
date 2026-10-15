package com.eduflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseModuleRequest {
    @NotBlank
    private String title;
    private String content;
    private Integer sortOrder;
}
