# Exam Preparation App with Adaptive Quizzes

DBSE + DBD project starter.

## Current version
- Frontend: HTML, CSS, JavaScript
- Backend: Spring Boot + Java
- Database: MySQL
- ORM: Spring Data JPA / Hibernate
- API: REST
- API testing: Postman
- MongoDB, JWT, Docker, Swagger, testing and monitoring will be added in later phases.

## Project structure

ExamPreparationApp/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/examprep/
│           │   ├── ExamPrepApplication.java
│           │   ├── controller/
│           │   ├── entity/
│           │   ├── repository/
│           │   └── service/
│           └── resources/
│               ├── application.properties
│               └── schema.sql
└── database/
    └── exam_prep_db.sql

## Important
The backend uses Java 17+ and Spring Boot 3.5.x.
Install/configure a JDK before running the backend.

## Run backend
1. Make sure MySQL is running.
2. Create/import the database using database/exam_prep_db.sql.
3. Run database/seed_quiz_questions.sql against exam_prep_db to add basic questions for every subject.
4. Update backend/src/main/resources/application.properties with your MySQL username/password.
5. Open the backend folder in VS Code.
6. Run ExamPrepApplication.java or run `mvn spring-boot:run` from `backend/`.
7. Open http://localhost:8080/ to use the frontend and backend together.

The backend serves the files from `frontend/`, so do not open `frontend/index.html` directly or use a separate frontend server for the normal workflow.

From the outer workspace folder, double-click `start-exam-prep.cmd` to start the backend in a separate window and open the application automatically.

API:
GET http://localhost:8080/api/subjects
