package com.eduflow.repository;

import com.eduflow.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("""
            select enrollment
            from Enrollment enrollment
            join fetch enrollment.course
            where enrollment.student.id = :studentId
            order by enrollment.enrolledAt desc
            """)
    List<Enrollment> findForStudent(Long studentId);

    @Query("""
            select enrollment
            from Enrollment enrollment
            join fetch enrollment.course
            join fetch enrollment.student
            order by enrollment.enrolledAt desc
            """)
    List<Enrollment> findAllWithPeople();

    void deleteByCourseId(Long courseId);

    void deleteByStudentId(Long studentId);
}
