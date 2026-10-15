# EduFlow

EduFlow is a coaching portal with two separate websites. Students enroll themselves, read class notes, and send questions. Staff publish courses, post notices, and reply. A student account cannot open the staff site.

## Stack

- Java 21
- Spring Boot 4.1, Spring Security, JWT
- Spring Data JPA and Flyway
- MySQL
- React, Vite, and Tailwind

There is no message broker. Notices are rows in MySQL. The open student page asks the student service for new notices.

## Layout

```text
student-app      :5173   student website
admin-app        :5174   staff website
student-service  :8086   student API
admin-service    :8085   staff API
MySQL            :3306   database eduflow
```

The student site talks only to the student service. The staff site talks only to the admin service. Both services use the same database and the same JWT secret.

Start the admin service first. Flyway creates the tables and the demo staff account. Then start the student service.

## Run it

MySQL must be running. Copy `.env.example` to `.env` and set your own database password. Do not commit `.env`.

PowerShell:

```powershell
$env:MYSQL_PASSWORD = "your-mysql-password"
$env:JWT_SECRET = "eduflow-dev-only-change-this-secret-key-before-any-real-deploy"
```

Use the same `JWT_SECRET` for both services.

```powershell
cd admin-service
mvn spring-boot:run
```

```powershell
cd student-service
mvn spring-boot:run
```

```powershell
cd student-app
npm install
npm run dev
```

```powershell
cd admin-app
npm install
npm run dev
```

## Demo login

Staff site: http://localhost:5174

- Email: `admin@eduflow.com`
- Password: `Admin@12345`

Student site: http://localhost:5173

Create an account there. Signup always creates a student. There is no role choice, and that account is rejected on the staff site.

## What each side does

Student: sign up, browse courses, enroll, read notes, download a PDF when one is attached, read notices, ask a question.

Staff: create courses and lessons, attach a PDF, see who enrolled, post a notice, reply to questions. Staff do not enroll students.

Lesson files are stored under the home folder in `eduflow-uploads`. That folder is not part of the repository.
