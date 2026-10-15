package com.eduflow.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CourseWorkspaceDto {
    private CourseDto course;
    private List<CourseModuleDto> modules;
    private List<CourseAnnouncementDto> announcements;
    private long enrolledCount;
    private boolean enrolled;
    private List<CourseRosterEntryDto> roster;
}
