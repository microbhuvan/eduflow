package com.eduflow.service;

import com.eduflow.dto.PortalDtos.CourseDetail;
import com.eduflow.dto.PortalDtos.CourseSummary;
import com.eduflow.dto.PortalDtos.EnrollmentView;
import com.eduflow.dto.PortalDtos.LessonView;
import com.eduflow.exception.ApiException;
import com.eduflow.model.Course;
import com.eduflow.model.Enrollment;
import com.eduflow.model.Lesson;
import com.eduflow.model.User;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.repository.LessonRepository;
import com.eduflow.repository.UserRepository;
import com.eduflow.security.CurrentUser;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;
    private final PdfStorage pdfStorage;

    public CourseService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CurrentUser currentUser,
            PdfStorage pdfStorage
    ) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
        this.pdfStorage = pdfStorage;
    }

    public List<CourseSummary> listCourses() {
        Long studentId = currentUser.get().getId();
        return courseRepository.findAllByOrderByTitleAsc().stream()
                .map(course -> new CourseSummary(
                        course.getId(),
                        course.getCode(),
                        course.getTitle(),
                        course.getDescription(),
                        enrollmentRepository.existsByStudentIdAndCourseId(studentId, course.getId())
                ))
                .toList();
    }

    public CourseDetail getCourse(Long courseId) {
        Course course = findCourse(courseId);
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(currentUser.get().getId(), courseId);
        List<LessonView> lessons = lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId).stream()
                .map(lesson -> toLesson(lesson, enrolled))
                .toList();
        return new CourseDetail(
                course.getId(),
                course.getCode(),
                course.getTitle(),
                course.getDescription(),
                enrolled,
                lessons
        );
    }

    @Transactional
    public EnrollmentView enroll(Long courseId) {
        Course course = findCourse(courseId);
        User student = userRepository.findById(currentUser.get().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in."));
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You are already enrolled in this course.");
        }
        Enrollment enrollment = enrollmentRepository.save(new Enrollment(student, course));
        return new EnrollmentView(enrollment.getId(), course.getId(), course.getCode(), course.getTitle(), enrollment.getEnrolledAt());
    }

    public List<EnrollmentView> myCourses() {
        return enrollmentRepository.findForStudent(currentUser.get().getId()).stream()
                .map(enrollment -> new EnrollmentView(
                        enrollment.getId(),
                        enrollment.getCourse().getId(),
                        enrollment.getCourse().getCode(),
                        enrollment.getCourse().getTitle(),
                        enrollment.getEnrolledAt()
                ))
                .toList();
    }

    public Resource downloadPdf(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lesson not found."));
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(
                currentUser.get().getId(),
                lesson.getCourse().getId()
        );
        if (!enrolled) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Enroll in the course to download this PDF.");
        }
        if (lesson.getPdfFileName() == null || lesson.getPdfFileName().isBlank()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "This lesson has no PDF.");
        }
        Path file = pdfStorage.resolve(lesson.getPdfFileName());
        if (!Files.exists(file)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "The PDF file is missing.");
        }
        return new FileSystemResource(file);
    }

    private Course findCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found."));
    }

    private LessonView toLesson(Lesson lesson, boolean enrolled) {
        if (!enrolled) {
            return new LessonView(lesson.getId(), lesson.getTitle(), null, false, lesson.getSortOrder());
        }
        boolean hasPdf = lesson.getPdfFileName() != null && !lesson.getPdfFileName().isBlank();
        return new LessonView(lesson.getId(), lesson.getTitle(), lesson.getNotes(), hasPdf, lesson.getSortOrder());
    }
}
