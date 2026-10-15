package com.eduflow.repository;

import com.eduflow.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByOrderByTitleAsc();

    Optional<Course> findByCode(String code);

    boolean existsByCode(String code);
}
