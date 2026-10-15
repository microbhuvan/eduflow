package com.eduflow.service;

import com.eduflow.dto.AdminDtos.DashboardView;
import com.eduflow.dto.AdminDtos.EnrollmentView;
import com.eduflow.dto.AdminDtos.NoticeRequest;
import com.eduflow.dto.AdminDtos.NoticeView;
import com.eduflow.dto.AdminDtos.QuestionView;
import com.eduflow.dto.AdminDtos.ReplyRequest;
import com.eduflow.exception.ApiException;
import com.eduflow.model.Notice;
import com.eduflow.model.Role;
import com.eduflow.model.StudentQuery;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.EnrollmentRepository;
import com.eduflow.repository.NoticeRepository;
import com.eduflow.repository.StudentQueryRepository;
import com.eduflow.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DeskAdminService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final NoticeRepository noticeRepository;
    private final StudentQueryRepository queryRepository;

    public DeskAdminService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            NoticeRepository noticeRepository,
            StudentQueryRepository queryRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.noticeRepository = noticeRepository;
        this.queryRepository = queryRepository;
    }

    public DashboardView dashboard() {
        return new DashboardView(
                userRepository.findByRoleOrderByNameAsc(Role.STUDENT).size(),
                courseRepository.count(),
                enrollmentRepository.count(),
                queryRepository.countByReplyIsNull()
        );
    }

    public List<EnrollmentView> enrollments() {
        return enrollmentRepository.findAllWithPeople().stream()
                .map(enrollment -> new EnrollmentView(
                        enrollment.getId(),
                        enrollment.getStudent().getName(),
                        enrollment.getStudent().getEmail(),
                        enrollment.getCourse().getCode(),
                        enrollment.getCourse().getTitle(),
                        enrollment.getEnrolledAt()
                ))
                .toList();
    }

    public NoticeView postNotice(NoticeRequest request) {
        Notice notice = noticeRepository.save(new Notice(request.title().trim(), request.message().trim()));
        return toNotice(notice);
    }

    public List<NoticeView> notices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toNotice).toList();
    }

    public List<QuestionView> questions() {
        return queryRepository.findAllWithStudent().stream().map(this::toQuestion).toList();
    }

    public QuestionView reply(Long questionId, ReplyRequest request) {
        StudentQuery question = queryRepository.findById(questionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Question not found."));
        question.setReply(request.reply().trim());
        question.setRepliedAt(Instant.now());
        return toQuestion(queryRepository.save(question));
    }

    private NoticeView toNotice(Notice notice) {
        return new NoticeView(notice.getId(), notice.getTitle(), notice.getMessage(), notice.getCreatedAt());
    }

    private QuestionView toQuestion(StudentQuery question) {
        return new QuestionView(
                question.getId(),
                question.getStudent().getName(),
                question.getStudent().getEmail(),
                question.getSubject(),
                question.getMessage(),
                question.getReply(),
                question.getCreatedAt(),
                question.getRepliedAt()
        );
    }
}
