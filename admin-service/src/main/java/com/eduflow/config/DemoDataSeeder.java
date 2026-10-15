package com.eduflow.config;

import com.eduflow.model.Course;
import com.eduflow.model.Lesson;
import com.eduflow.model.Notice;
import com.eduflow.model.Role;
import com.eduflow.model.User;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.LessonRepository;
import com.eduflow.repository.NoticeRepository;
import com.eduflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DemoDataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final NoticeRepository noticeRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            UserRepository userRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            NoticeRepository noticeRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.noticeRepository = noticeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.findByEmail("admin@eduflow.com").isEmpty()) {
            userRepository.save(new User(
                    "EduFlow Admin",
                    "admin@eduflow.com",
                    passwordEncoder.encode("Admin@12345"),
                    Role.ADMIN
            ));
        }
        if (courseRepository.count() > 0) {
            return;
        }

        Course java = courseRepository.save(new Course(
                "JAVA201",
                "Core Java for interviews",
                "A working set of notes on the language features that show up in fresher interviews: types, collections, exceptions, and how a small program is actually structured."
        ));
        lessonRepository.save(lesson(java, 0, "How a Java program is laid out",
                """
                A class is the file you write. A method is a named block of work. main is the method the runtime calls first.

                Keep one responsibility in a method. If a method both reads input and calculates a result and prints it, split those steps. Interviewers ask you to walk a method out loud. Short methods make that possible.

                Packages are folders for classes. com.eduflow.service holds the classes that do the work. Controllers only receive the request and return the answer.
                """));
        lessonRepository.save(lesson(java, 1, "Collections you will actually use",
                """
                List keeps order and allows duplicates. Use it for courses, lessons, and notices.

                Set rejects a duplicate. That is the idea behind a unique email.

                Map stores a value under a key. A login token stored against an email is a map, even when the real store is a database table.

                Do not reach for a complicated structure until a List is too slow or the rule is about uniqueness.
                """));

        Course spring = courseRepository.save(new Course(
                "SB301",
                "Spring Boot service design",
                "How a request moves through a small Spring Boot service: security, a controller, a service, and a repository. Written for the EduFlow staff and student split."
        ));
        lessonRepository.save(lesson(spring, 0, "One request, one path",
                """
                The browser calls a URL. Spring Security checks the token. The controller reads the JSON. The service applies the rule. The repository talks to MySQL.

                If you can point at those four steps, you can explain the project. Extra layers make the path harder to follow and do not make the product better.

                The student service and the admin service are two programs. They share the database. They do not share a login page.
                """));
        lessonRepository.save(lesson(spring, 1, "Roles live in the database",
                """
                Signup on the student site always saves the role STUDENT. The browser is not allowed to choose ADMIN.

                The staff account is created by the application the first time the admin service starts. The login method then refuses any account whose role is not ADMIN.

                A copied student token still fails on the admin service, because every staff URL requires ROLE_ADMIN.
                """));

        noticeRepository.save(new Notice(
                "Week 1 notes are posted",
                "Core Java notes for the first two lessons are available inside JAVA201. Enroll from the course page to read them. A PDF will be added when the staff desk attaches one."
        ));
    }

    private Lesson lesson(Course course, int order, String title, String notes) {
        return new Lesson(course, title, notes.strip(), order);
    }
}
