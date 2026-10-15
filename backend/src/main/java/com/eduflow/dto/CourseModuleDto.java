package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseModuleDto {
    private Long id;
    private String title;
    private String content;
    private Integer sortOrder;
}
