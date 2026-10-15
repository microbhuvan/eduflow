package com.eduflow.service;

import com.eduflow.dto.PortalDtos.NoticeView;
import com.eduflow.dto.PortalDtos.QuestionRequest;
import com.eduflow.dto.PortalDtos.QuestionView;
import com.eduflow.model.StudentQuery;
import com.eduflow.model.User;
import com.eduflow.repository.NoticeRepository;
import com.eduflow.repository.StudentQueryRepository;
import com.eduflow.repository.UserRepository;
import com.eduflow.security.CurrentUser;
import com.eduflow.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeskService {
    private final NoticeRepository noticeRepository;
    private final StudentQueryRepository queryRepository;
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    public DeskService(
            NoticeRepository noticeRepository,
            StudentQueryRepository queryRepository,
            UserRepository userRepository,
            CurrentUser currentUser
    ) {
        this.noticeRepository = noticeRepository;
        this.queryRepository = queryRepository;
        this.userRepository = userRepository;
        this.currentUser = currentUser;
    }

    public List<NoticeView> notices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(notice -> new NoticeView(notice.getId(), notice.getTitle(), notice.getMessage(), notice.getCreatedAt()))
                .toList();
    }

    public QuestionView ask(QuestionRequest request) {
        User student = userRepository.findById(currentUser.get().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in."));
        StudentQuery saved = queryRepository.save(new StudentQuery(
                student,
                request.subject().trim(),
                request.message().trim()
        ));
        return toView(saved);
    }

    public List<QuestionView> myQuestions() {
        return queryRepository.findByStudentIdOrderByCreatedAtDesc(currentUser.get().getId()).stream()
                .map(this::toView)
                .toList();
    }

    private QuestionView toView(StudentQuery question) {
        return new QuestionView(
                question.getId(),
                question.getSubject(),
                question.getMessage(),
                question.getReply(),
                question.getCreatedAt(),
                question.getRepliedAt()
        );
    }
}
