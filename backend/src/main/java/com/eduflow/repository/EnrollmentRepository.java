package com.eduflow.repository;

import com.eduflow.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByCourseId(Long courseId);
    List<Enrollment> findByCourseIdOrderByIdAsc(Long courseId);

    @Modifying
    @Query("DELETE FROM Enrollment e WHERE e.course.id = :courseId")
    int deleteByCourseId(@Param("courseId") Long courseId);
}
