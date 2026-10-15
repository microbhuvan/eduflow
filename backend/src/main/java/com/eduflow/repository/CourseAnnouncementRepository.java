package com.eduflow.repository;

import com.eduflow.model.CourseAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseAnnouncementRepository extends JpaRepository<CourseAnnouncement, Long> {
    List<CourseAnnouncement> findByCourseIdOrderByCreatedAtDesc(Long courseId);

    @Modifying
    @Query("DELETE FROM CourseAnnouncement a WHERE a.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

    @Modifying
    @Query("DELETE FROM CourseAnnouncement a WHERE a.id = :id AND a.course.id = :courseId")
    int deleteByIdAndCourseId(@Param("id") Long id, @Param("courseId") Long courseId);
}
