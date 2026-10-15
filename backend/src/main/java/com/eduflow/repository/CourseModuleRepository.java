package com.eduflow.repository;

import com.eduflow.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    List<CourseModule> findByCourseIdOrderBySortOrderAsc(Long courseId);

    @Modifying
    @Query("DELETE FROM CourseModule m WHERE m.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

    @Modifying
    @Query("DELETE FROM CourseModule m WHERE m.id = :id AND m.course.id = :courseId")
    int deleteByIdAndCourseId(@Param("id") Long id, @Param("courseId") Long courseId);
}
