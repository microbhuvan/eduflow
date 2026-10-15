package com.eduflow.service;

import com.eduflow.dto.*;
import com.eduflow.exception.BadRequestException;
import com.eduflow.exception.ResourceNotFoundException;
import com.eduflow.model.Course;
import com.eduflow.model.CourseAnnouncement;
import com.eduflow.model.CourseModule;
import com.eduflow.model.Role;
import com.eduflow.repository.CourseAnnouncementRepository;
import com.eduflow.repository.CourseModuleRepository;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final CourseAnnouncementRepository courseAnnouncementRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<CourseDto> findAll() {
        return courseRepository.findAll().stream().map(this::toDto).toList();
    }

    public CourseDto findById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return toDto(course);
    }

    @Transactional(readOnly = true)
    public CourseWorkspaceDto getWorkspace(Long courseId, UserPrincipal principal) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(principal.getId(), courseId);
        if (principal.getRole() == Role.STUDENT && !enrolled) {
            throw new BadRequestException("You must be enrolled to open this course");
        }
        long count = enrollmentRepository.countByCourseId(courseId);
        List<CourseModuleDto> modules = courseModuleRepository.findByCourseIdOrderBySortOrderAsc(courseId).stream()
                .map(this::toModuleDto)
                .toList();
        List<CourseAnnouncementDto> announcements = courseAnnouncementRepository
                .findByCourseIdOrderByCreatedAtDesc(courseId).stream()
                .map(this::toAnnouncementDto)
                .toList();
        List<CourseRosterEntryDto> roster = null;
        if (principal.getRole() == Role.ADMIN) {
            roster = enrollmentRepository.findByCourseIdOrderByIdAsc(courseId).stream()
                    .map(e -> CourseRosterEntryDto.builder()
                            .studentId(e.getStudent().getId())
                            .studentName(e.getStudent().getName())
                            .studentEmail(e.getStudent().getEmail())
                            .build())
                    .toList();
        }
        return CourseWorkspaceDto.builder()
                .course(toDto(course))
                .modules(modules)
                .announcements(announcements)
                .enrolledCount(count)
                .enrolled(enrolled || principal.getRole() == Role.ADMIN)
                .roster(roster)
                .build();
    }

    public CourseDto create(CourseRequest request) {
        validateCourseCodeUnique(request.getCourseCode(), null);
        Course course = courseRepository.save(mapNewCourse(request));
        return toDto(course);
    }

    public CourseDto update(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        validateCourseCodeUnique(request.getCourseCode(), id);
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCourseCode(blankToNull(request.getCourseCode()));
        course.setCredits(request.getCredits() != null ? request.getCredits() : 3);
        course.setSyllabus(request.getSyllabus());
        course.setLearningOutcomes(request.getLearningOutcomes());
        return toDto(courseRepository.save(course));
    }

    @Transactional
    public void delete(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found");
        }
        enrollmentRepository.deleteByCourseId(id);
        courseAnnouncementRepository.deleteByCourseId(id);
        courseModuleRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
    }

    @Transactional
    public CourseModuleDto addModule(Long courseId, CourseModuleRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        int order = request.getSortOrder() != null ? request.getSortOrder()
                : (int) courseModuleRepository.findByCourseIdOrderBySortOrderAsc(courseId).size();
        CourseModule module = courseModuleRepository.save(CourseModule.builder()
                .course(course)
                .title(request.getTitle())
                .content(request.getContent())
                .sortOrder(order)
                .build());
        return toModuleDto(module);
    }

    @Transactional
    public CourseModuleDto updateModule(Long courseId, Long moduleId, CourseModuleRequest request) {
        CourseModule module = courseModuleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        if (!module.getCourse().getId().equals(courseId)) {
            throw new BadRequestException("Module does not belong to this course");
        }
        module.setTitle(request.getTitle());
        module.setContent(request.getContent());
        if (request.getSortOrder() != null) {
            module.setSortOrder(request.getSortOrder());
        }
        return toModuleDto(courseModuleRepository.save(module));
    }

    @Transactional
    public void deleteModule(Long courseId, Long moduleId) {
        int deleted = courseModuleRepository.deleteByIdAndCourseId(moduleId, courseId);
        if (deleted == 0) {
            throw new ResourceNotFoundException("Module not found");
        }
    }

    @Transactional
    public CourseAnnouncementDto addAnnouncement(Long courseId, CourseAnnouncementRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        CourseAnnouncement ann = courseAnnouncementRepository.save(CourseAnnouncement.builder()
                .course(course)
                .title(request.getTitle())
                .message(request.getMessage())
                .build());
        return toAnnouncementDto(ann);
    }

    @Transactional
    public void deleteAnnouncement(Long courseId, Long announcementId) {
        int deleted = courseAnnouncementRepository.deleteByIdAndCourseId(announcementId, courseId);
        if (deleted == 0) {
            throw new ResourceNotFoundException("Announcement not found");
        }
    }

    private void validateCourseCodeUnique(String code, Long ignoreCourseId) {
        String normalized = blankToNull(code);
        if (normalized == null) {
            return;
        }
        courseRepository.findByCourseCodeIgnoreCase(normalized).ifPresent(c -> {
            if (ignoreCourseId == null || !c.getId().equals(ignoreCourseId)) {
                throw new BadRequestException("Course code already in use");
            }
        });
    }

    private Course mapNewCourse(CourseRequest request) {
        return Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .courseCode(blankToNull(request.getCourseCode()))
                .credits(request.getCredits() != null ? request.getCredits() : 3)
                .syllabus(request.getSyllabus())
                .learningOutcomes(request.getLearningOutcomes())
                .build();
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private CourseDto toDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .courseCode(course.getCourseCode())
                .credits(course.getCredits() != null ? course.getCredits() : 3)
                .syllabus(course.getSyllabus())
                .learningOutcomes(course.getLearningOutcomes())
                .build();
    }

    private CourseModuleDto toModuleDto(CourseModule m) {
        return CourseModuleDto.builder()
                .id(m.getId())
                .title(m.getTitle())
                .content(m.getContent())
                .sortOrder(m.getSortOrder())
                .build();
    }

    private CourseAnnouncementDto toAnnouncementDto(CourseAnnouncement a) {
        return CourseAnnouncementDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .message(a.getMessage())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
