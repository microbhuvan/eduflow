package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseRosterEntryDto {
    private Long studentId;
    private String studentName;
    private String studentEmail;
}
