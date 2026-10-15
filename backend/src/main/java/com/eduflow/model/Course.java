package com.eduflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses", uniqueConstraints = @UniqueConstraint(columnNames = "course_code"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Short catalog code, e.g. CS101 */
    @Column(name = "course_code", unique = true, length = 32)
    private String courseCode;

    @Column(nullable = false)
    @Builder.Default
    private Integer credits = 3;

    @Column(columnDefinition = "TEXT")
    private String syllabus;

    @Column(columnDefinition = "TEXT")
    private String learningOutcomes;
}
