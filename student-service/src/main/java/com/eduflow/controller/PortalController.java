package com.eduflow.controller;

import com.eduflow.dto.PortalDtos.CourseDetail;
import com.eduflow.dto.PortalDtos.CourseSummary;
import com.eduflow.dto.PortalDtos.EnrollmentView;
import com.eduflow.dto.PortalDtos.NoticeView;
import com.eduflow.dto.PortalDtos.QuestionRequest;
import com.eduflow.dto.PortalDtos.QuestionView;
import com.eduflow.service.CourseService;
import com.eduflow.service.DeskService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class PortalController {
    private final CourseService courseService;
    private final DeskService deskService;

    public PortalController(CourseService courseService, DeskService deskService) {
        this.courseService = courseService;
        this.deskService = deskService;
    }

    @GetMapping("/courses")
    public List<CourseSummary> courses() {
        return courseService.listCourses();
    }

    @GetMapping("/courses/{courseId}")
    public CourseDetail course(@PathVariable Long courseId) {
        return courseService.getCourse(courseId);
    }

    @PostMapping("/courses/{courseId}/enroll")
    public EnrollmentView enroll(@PathVariable Long courseId) {
        return courseService.enroll(courseId);
    }

    @GetMapping("/me/courses")
    public List<EnrollmentView> myCourses() {
        return courseService.myCourses();
    }

    @GetMapping("/lessons/{lessonId}/pdf")
    public ResponseEntity<Resource> pdf(@PathVariable Long lessonId) {
        Resource file = courseService.downloadPdf(lessonId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"lesson.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    @GetMapping("/notices")
    public List<NoticeView> notices() {
        return deskService.notices();
    }

    @GetMapping("/questions")
    public List<QuestionView> questions() {
        return deskService.myQuestions();
    }

    @PostMapping("/questions")
    public QuestionView ask(@Valid @RequestBody QuestionRequest request) {
        return deskService.ask(request);
    }
}
