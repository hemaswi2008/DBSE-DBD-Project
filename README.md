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

## Run frontend
Open frontend/index.html in a browser, or use VS Code Live Server.

## Run backend
1. Make sure MySQL is running.
2. Create/import the database using database/exam_prep_db.sql.
3. Run database/seed_quiz_questions.sql against exam_prep_db to add the basic Database Systems, Java Programming, and Web Development questions.
4. Run database/seed_adaptive_quiz_questions.sql against exam_prep_db to replace duplicate Artificial Intelligence samples with distinct prompts and add hard questions for every subject that has a seeded basic question pool. Rerun this file safely whenever you need to restore those question pools.
    The frontend supplies 10 generated Easy questions, 10 Moderate questions, and a subject-specific Hard question bank per subject. A student progresses through six 10-question quizzes in order: Easy, Moderate, then four Hard rounds, with no question repeated within that sequence. Completed question IDs persist across reloads; starting a subject again begins a fresh sequence.
5. Update backend/src/main/resources/application.properties with your MySQL username/password.
6. Open the backend folder in VS Code.
7. Run ExamPrepApplication.java.

API:
GET http://localhost:8080/api/subjects
