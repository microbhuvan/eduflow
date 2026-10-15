package com.eduflow.service;

import com.eduflow.dto.AdminDtos.CourseDetail;
import com.eduflow.dto.AdminDtos.CourseRequest;
import com.eduflow.dto.AdminDtos.CourseView;
import com.eduflow.dto.AdminDtos.LessonRequest;
import com.eduflow.dto.AdminDtos.LessonView;
import com.eduflow.exception.ApiException;
import com.eduflow.model.Course;
import com.eduflow.model.Lesson;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.repository.LessonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CourseAdminService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PdfStorage pdfStorage;

    public CourseAdminService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            PdfStorage pdfStorage
    ) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.pdfStorage = pdfStorage;
    }

    public List<CourseView> list() {
        return courseRepository.findAllByOrderByTitleAsc().stream()
                .map(this::toSummary)
                .toList();
    }

    public CourseDetail get(Long courseId) {
        Course course = findCourse(courseId);
        List<LessonView> lessons = lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId).stream()
                .map(this::toLesson)
                .toList();
        return new CourseDetail(course.getId(), course.getCode(), course.getTitle(), course.getDescription(), lessons);
    }

    public CourseDetail create(CourseRequest request) {
        String code = request.code().trim().toUpperCase();
        if (courseRepository.existsByCode(code)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "That course code is already in use.");
        }
        Course course = courseRepository.save(new Course(code, request.title().trim(), request.description().trim()));
        return get(course.getId());
    }

    public CourseDetail update(Long courseId, CourseRequest request) {
        Course course = findCourse(courseId);
        String code = request.code().trim().toUpperCase();
        courseRepository.findByCode(code).ifPresent(existing -> {
            if (!existing.getId().equals(courseId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "That course code is already in use.");
            }
        });
        course.setCode(code);
        course.setTitle(request.title().trim());
        course.setDescription(request.description().trim());
        courseRepository.save(course);
        return get(courseId);
    }

    @Transactional
    public void delete(Long courseId) {
        findCourse(courseId);
        lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId)
                .forEach(lesson -> pdfStorage.delete(lesson.getPdfFileName()));
        enrollmentRepository.deleteByCourseId(courseId);
        lessonRepository.deleteByCourseId(courseId);
        courseRepository.deleteById(courseId);
    }

    public LessonView addLesson(Long courseId, LessonRequest request) {
        Course course = findCourse(courseId);
        int nextOrder = lessonRepository.countByCourseId(courseId);
        Lesson lesson = lessonRepository.save(new Lesson(course, request.title().trim(), request.notes().trim(), nextOrder));
        return toLesson(lesson);
    }

    public LessonView updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = findLesson(lessonId);
        lesson.setTitle(request.title().trim());
        lesson.setNotes(request.notes().trim());
        return toLesson(lessonRepository.save(lesson));
    }

    public LessonView attachPdf(Long lessonId, MultipartFile file) {
        Lesson lesson = findLesson(lessonId);
        pdfStorage.delete(lesson.getPdfFileName());
        lesson.setPdfFileName(pdfStorage.store(lessonId, file));
        return toLesson(lessonRepository.save(lesson));
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = findLesson(lessonId);
        pdfStorage.delete(lesson.getPdfFileName());
        lessonRepository.delete(lesson);
    }

    private Course findCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found."));
    }

    private Lesson findLesson(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lesson not found."));
    }

    private CourseView toSummary(Course course) {
        return new CourseView(
                course.getId(),
                course.getCode(),
                course.getTitle(),
                course.getDescription(),
                lessonRepository.countByCourseId(course.getId())
        );
    }

    private LessonView toLesson(Lesson lesson) {
        boolean hasPdf = lesson.getPdfFileName() != null && !lesson.getPdfFileName().isBlank();
        return new LessonView(lesson.getId(), lesson.getTitle(), lesson.getNotes(), hasPdf, lesson.getSortOrder());
    }
}
