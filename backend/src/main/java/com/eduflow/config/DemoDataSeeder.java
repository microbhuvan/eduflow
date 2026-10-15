package com.eduflow.config;

import com.eduflow.model.Course;
import com.eduflow.model.CourseAnnouncement;
import com.eduflow.model.CourseModule;
import com.eduflow.repository.CourseAnnouncementRepository;
import com.eduflow.repository.CourseModuleRepository;
import com.eduflow.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds sample courses with modules and announcements when the database has no courses,
 * so demos and examiner walkthroughs are not empty.
 */
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.demo-seed", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements CommandLineRunner {
    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final CourseAnnouncementRepository courseAnnouncementRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            return;
        }
        Course web = courseRepository.save(Course.builder()
                .title("Full Stack Web Development")
                .courseCode("WEB201")
                .credits(4)
                .description("Build production-ready web apps with React, Spring Boot, and PostgreSQL.")
                .syllabus("Weeks 1–2: HTTP, REST, and security basics.\nWeeks 3–5: Spring Boot APIs and JPA.\nWeeks 6–8: React SPA, routing, and state.\nWeeks 9–10: Integration, deployment, and review.")
                .learningOutcomes("Design REST APIs with validation and error handling.\nImplement JWT authentication end-to-end.\nShip a responsive SPA with role-based navigation.")
                .build());

        courseModuleRepository.save(CourseModule.builder()
                .course(web)
                .title("Module 1 — HTTP & REST foundations")
                .sortOrder(0)
                .content("Resources: RFC 9110 overview, Postman collection in repo.\nLab: CRUD for a single resource with proper status codes.")
                .build());
        courseModuleRepository.save(CourseModule.builder()
                .course(web)
                .title("Module 2 — Spring Boot & JPA")
                .sortOrder(1)
                .content("Entity relationships, transactions, and repository patterns.\nLab: model Users, Courses, and Enrollments.")
                .build());
        courseModuleRepository.save(CourseModule.builder()
                .course(web)
                .title("Module 3 — React client integration")
                .sortOrder(2)
                .content("Axios interceptors, protected routes, and optimistic UI patterns.\nLab: connect login and dashboard to your API.")
                .build());

        courseAnnouncementRepository.save(CourseAnnouncement.builder()
                .course(web)
                .title("Welcome to WEB201")
                .message("Use EduFlow to track modules and announcements. Enroll via your admin, then open this course from My Courses.")
                .build());

        Course db = courseRepository.save(Course.builder()
                .title("Database Systems")
                .courseCode("DB101")
                .credits(3)
                .description("Relational design, SQL, and PostgreSQL in practice.")
                .syllabus("ER modeling, normalization, SQL joins, indexing, and transactions.")
                .learningOutcomes("Model data with integrity constraints.\nWrite efficient queries and explain plans.\nApply migrations in a team workflow.")
                .build());

        courseModuleRepository.save(CourseModule.builder()
                .course(db)
                .title("Module 1 — ER modeling & normalization")
                .sortOrder(0)
                .content("Readings: textbook ch. 2–4. Assignment: design schema for a learning platform.")
                .build());

        courseAnnouncementRepository.save(CourseAnnouncement.builder()
                .course(db)
                .title("First lab released")
                .message("Import the sample dataset from the course drive and complete normalization exercises.")
                .build());
    }
}
