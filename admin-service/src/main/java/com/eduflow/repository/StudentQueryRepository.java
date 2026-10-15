package com.eduflow.repository;

import com.eduflow.model.StudentQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentQueryRepository extends JpaRepository<StudentQuery, Long> {
    List<StudentQuery> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    long countByReplyIsNull();

    @Query("""
            select question
            from StudentQuery question
            join fetch question.student
            order by question.createdAt desc
            """)
    List<StudentQuery> findAllWithStudent();

    void deleteByStudentId(Long studentId);
}
