package com.eduflow.controller;

import com.eduflow.dto.AdminDtos.CourseDetail;
import com.eduflow.dto.AdminDtos.CourseRequest;
import com.eduflow.dto.AdminDtos.CourseView;
import com.eduflow.dto.AdminDtos.DashboardView;
import com.eduflow.dto.AdminDtos.EnrollmentView;
import com.eduflow.dto.AdminDtos.LessonRequest;
import com.eduflow.dto.AdminDtos.LessonView;
import com.eduflow.dto.AdminDtos.NoticeRequest;
import com.eduflow.dto.AdminDtos.NoticeView;
import com.eduflow.dto.AdminDtos.QuestionView;
import com.eduflow.dto.AdminDtos.ReplyRequest;
import com.eduflow.dto.AdminDtos.StudentRequest;
import com.eduflow.dto.AdminDtos.StudentView;
import com.eduflow.service.CourseAdminService;
import com.eduflow.service.DeskAdminService;
import com.eduflow.service.StudentAdminService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class AdminController {
    private final StudentAdminService studentAdminService;
    private final CourseAdminService courseAdminService;
    private final DeskAdminService deskAdminService;

    public AdminController(
            StudentAdminService studentAdminService,
            CourseAdminService courseAdminService,
            DeskAdminService deskAdminService
    ) {
        this.studentAdminService = studentAdminService;
        this.courseAdminService = courseAdminService;
        this.deskAdminService = deskAdminService;
    }

    @GetMapping("/dashboard")
    public DashboardView dashboard() {
        return deskAdminService.dashboard();
    }

    @GetMapping("/students")
    public List<StudentView> students() {
        return studentAdminService.list();
    }

    @PostMapping("/students")
    public StudentView createStudent(@Valid @RequestBody StudentRequest request) {
        return studentAdminService.create(request);
    }

    @DeleteMapping("/students/{studentId}")
    public void deleteStudent(@PathVariable Long studentId) {
        studentAdminService.delete(studentId);
    }

    @GetMapping("/courses")
    public List<CourseView> courses() {
        return courseAdminService.list();
    }

    @PostMapping("/courses")
    public CourseDetail createCourse(@Valid @RequestBody CourseRequest request) {
        return courseAdminService.create(request);
    }

    @GetMapping("/courses/{courseId}")
    public CourseDetail course(@PathVariable Long courseId) {
        return courseAdminService.get(courseId);
    }

    @PutMapping("/courses/{courseId}")
    public CourseDetail updateCourse(@PathVariable Long courseId, @Valid @RequestBody CourseRequest request) {
        return courseAdminService.update(courseId, request);
    }

    @DeleteMapping("/courses/{courseId}")
    public void deleteCourse(@PathVariable Long courseId) {
        courseAdminService.delete(courseId);
    }

    @PostMapping("/courses/{courseId}/lessons")
    public LessonView addLesson(@PathVariable Long courseId, @Valid @RequestBody LessonRequest request) {
        return courseAdminService.addLesson(courseId, request);
    }

    @PutMapping("/lessons/{lessonId}")
    public LessonView updateLesson(@PathVariable Long lessonId, @Valid @RequestBody LessonRequest request) {
        return courseAdminService.updateLesson(lessonId, request);
    }

    @PostMapping(value = "/lessons/{lessonId}/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public LessonView attachPdf(@PathVariable Long lessonId, @RequestParam("file") MultipartFile file) {
        return courseAdminService.attachPdf(lessonId, file);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public void deleteLesson(@PathVariable Long lessonId) {
        courseAdminService.deleteLesson(lessonId);
    }

    @GetMapping("/enrollments")
    public List<EnrollmentView> enrollments() {
        return deskAdminService.enrollments();
    }

    @GetMapping("/notices")
    public List<NoticeView> notices() {
        return deskAdminService.notices();
    }

    @PostMapping("/notices")
    public NoticeView postNotice(@Valid @RequestBody NoticeRequest request) {
        return deskAdminService.postNotice(request);
    }

    @GetMapping("/questions")
    public List<QuestionView> questions() {
        return deskAdminService.questions();
    }

    @PostMapping("/questions/{questionId}/reply")
    public QuestionView reply(@PathVariable Long questionId, @Valid @RequestBody ReplyRequest request) {
        return deskAdminService.reply(questionId, request);
    }
}
