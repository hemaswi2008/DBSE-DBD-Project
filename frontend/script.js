let currentSubject = "";
let currentTopic = null;
let currentQuizId = null;
let currentLevel = 1;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let previousScore = null;
let currentScore = null;
let weakTopic = "None";
let currentQuizQuestions = [];
let quizCount = 0;
let subjectNames = [];
let currentStudent = null;
let currentDifficulty = "EASY";
let currentQuizCatalog = [];
let quizReview = [];

const API_BASE_URL = (() => {
    const configuredUrl = window.EXAM_PREP_API_URL;
    if (configuredUrl && configuredUrl.trim()) {
        return configuredUrl.trim().replace(/\/$/, "");
    }

    const isLocalFrontend = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (window.location.protocol === "file:" || (isLocalFrontend && window.location.port !== "8080")) {
        return "http://localhost:8080";
    }

    return window.location.origin;
})();

function apiFetch(path, options) {
    return fetch(`${API_BASE_URL}${path}`, options);
}

function saveSession() {
    if (currentStudent) {
        localStorage.setItem("examPrepStudent", JSON.stringify(currentStudent));
    } else {
        localStorage.removeItem("examPrepStudent");
    }
}

function restoreSession() {
    const savedStudent = localStorage.getItem("examPrepStudent");
    if (!savedStudent) return false;

    try {
        currentStudent = JSON.parse(savedStudent);
        return true;
    } catch (error) {
        localStorage.removeItem("examPrepStudent");
        currentStudent = null;
        return false;
    }
}

const sampleQuizzes = {};
const fallbackSubjects = [
    "Database Systems",
    "Java Programming",
    "Web Development",
    "Data Structures",
    "Artificial Intelligence",
    "Statistics",
    "Computer Networks",
    "Operating Systems",
    "Discrete Mathematics",
    "Python Programming",
    "C Programming",
    "Electrical Engineering",
    "Electronics and Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biomedical Engineering",
    "Aerospace Engineering",
    "Environmental Engineering",
    "Robotics Engineering",
    "Software Engineering",
    "Information Technology",
    "Control Systems",
    "Engineering Mathematics"
];
const questionDifficultyByLevel = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
    4: "HARD",
    5: "EXPERT"
};

const subjectIcons = {
    "Database Systems": "🗄️",
    "Java Programming": "☕",
    "Web Development": "🌐",
    "Data Structures": "📚",
    "Artificial Intelligence": "🤖",
    "Statistics": "📊",
    "Computer Networks": "💻",
    "Operating Systems": "🖥️",
    "Discrete Mathematics": "🔢",
    "Python Programming": "🐍",
    "C Programming": "⚙️"
};

const subjectDescriptions = {
    "Database Systems": "SQL, Normalization, Transactions, ER Model",
    "Java Programming": "OOP, Arrays, Collections, Exception Handling",
    "Web Development": "HTML, CSS, JavaScript, HTTP",
    "Data Structures": "Arrays, Linked Lists, Stacks, Queues, Trees",
    "Artificial Intelligence": "Search, Heuristics, Agents and AI Algorithms",
    "Statistics": "Mean, Median, Probability and Standard Deviation",
    "Computer Networks": "OSI, TCP/IP, HTTP and Network Security",
    "Operating Systems": "Processes, Threads, Scheduling and Memory",
    "Discrete Mathematics": "Sets, Relations, Graphs and Logic",
    "Python Programming": "Basics, Functions, Lists and OOP",
    "C Programming": "Basics, Arrays, Pointers, Functions and Structures"
};

const topicExplanations = {
    SQL: {
        title: 'SQL and Database Fundamentals',
        overview: `SQL, or Structured Query Language, is the standard language used to communicate with relational databases. At the most basic level, a database is a structured way of storing data so that it can be accessed, updated, queried, and managed in a consistent and efficient way. Data is stored in tables, where each row represents a record and each column represents a specific attribute of that record. For example, a students table may have rows for each student and columns such as student_id, name, email, and enrollment_year. SQL allows us to read that data, insert new records, modify information, and delete records when needed. Without SQL, data would be difficult to organize, search, and analyze, especially when an application grows beyond a few simple records.`,
        foundations: `To understand SQL properly, we must start from the basics of data models and relationships. A table is a collection of related records, and a relational database is built from multiple tables that connect to each other through shared values. A primary key is a column or combination of columns that uniquely identifies each row in a table. A foreign key is a column in one table that points to the primary key of another table, creating a relationship between the two tables. This is critical because it helps prevent broken or inconsistent data. For example, a quiz_attempts table may include a student_id that refers to the student_id in the students table. This relationship tells the database that each quiz attempt belongs to a specific student. The basic SQL commands include SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, and DROP. SELECT is used to read data, INSERT adds new rows, UPDATE changes values, and DELETE removes rows.`,
        concepts: `A more complete understanding of SQL comes from learning how data is filtered, grouped, and joined. The WHERE clause filters rows based on a condition. For example, WHERE score >= 75 selects only records with a passing score. ORDER BY arranges the result in ascending or descending order, which is helpful when showing top performers first. DISTINCT removes duplicate values. LIMIT restricts the number of rows returned. GROUP BY combines rows with the same value so that aggregate functions can be applied to each group. Aggregate functions such as COUNT(), SUM(), AVG(), MIN(), and MAX() allow us to summarize data instead of listing every row. HAVING works after grouping and is used to filter grouped results. A query can also use subqueries, which are queries inside queries, to answer more advanced questions. Joins are especially important because real-world data is usually spread across multiple related tables. INNER JOIN returns only matching rows, LEFT JOIN keeps all rows from the left table even when there is no match, RIGHT JOIN keeps all rows from the right table, and FULL JOIN keeps all records from both sides, depending on the database system.`,
        example: `Imagine a school database with a students table and a quiz_attempts table. The students table contains student_id, name, and email, while the quiz_attempts table contains attempt_id, student_id, quiz_id, score, and attempted_at. If we want to find the average score for each student, we can write: SELECT s.name, AVG(a.score) AS average_score FROM students s LEFT JOIN quiz_attempts a ON s.student_id = a.student_id GROUP BY s.student_id, s.name ORDER BY average_score DESC; This query joins the two tables using the relationship between student_id, groups the results by student, and calculates the average score. The LEFT JOIN ensures that students who have never taken a quiz still appear in the result with a null or empty average depending on how the query is written. This example shows why SQL is so useful: it lets us combine separate pieces of data and transform them into meaningful information for reports, analysis, and dashboards.`,
        applications: `SQL is used in almost every data-driven system. It is used in student management platforms to store records of admissions and results, in hospitals to track appointments and patients, in e-commerce systems to manage product catalogs and orders, in banking systems to keep track of transactions, and in analytics tools to summarize business performance. In an application like this one, SQL helps store subjects, topics, quiz questions, attempts, and student progress. It can answer questions such as which students are failing a subject, which topic needs revision, or which quiz level has the lowest average. SQL is fundamental to backend development because the server often needs to read and write structured information from a database. Good SQL skills are therefore highly valuable not only for exams but also for real software development careers.`,
        mistakes: `A very common mistake is forgetting that WHERE works before grouping, while HAVING works after grouping. This means WHERE filters individual rows, while HAVING filters aggregated groups. Another common issue is using UPDATE or DELETE without a WHERE clause, which can accidentally change or remove every record in the table. Confusing primary keys and foreign keys is another frequent error; the primary key identifies a row in its own table, while the foreign key creates a link to another table. Students also often misuse JOINs and accidentally create duplicate rows by joining tables that have multiple matching records. A query may look correct at first glance, but if the join is incorrect, the result can be misleading. Another important rule is to think about data integrity: a database should prevent inconsistent data. This is why constraints, keys, and normalization matter. SQL is not only about writing a query; it is about writing the correct query for the correct data model and business rule.`,
        extra: `The best way to learn SQL is by thinking in terms of tables, relationships, and questions. Start with simple queries such as selecting all rows from a table, then move to filtering with WHERE, then to sorting with ORDER BY, then to grouping and joins. Always test your understanding with small examples. If a query returns unexpected data, break it down step by step: first decide which table you need, then decide the relationship between tables, then decide which rows should be selected, and finally decide which columns should be displayed. This systematic approach will make SQL much easier to learn and much more reliable when used in real applications.`
    },
    OOP: {
        title: 'Java Object-Oriented Programming',
        overview: `Object-Oriented Programming, or OOP, is a programming style where software is designed around objects instead of only functions and procedures. At the most basic level, an object is a real-world or conceptual entity that has both state and behavior. State means the data stored inside the object, while behavior means the actions it can perform. For example, a Student object may have a name, email, and score as its data, and methods such as register(), submitQuiz(), and calculateAverage() as its behavior. A class is a blueprint that defines how objects of that type should be created and what attributes and methods they should have. In Java, classes are the foundation of code organization and software design.`,
        foundations: `The fundamental ideas of OOP are encapsulation, inheritance, polymorphism, and abstraction. Encapsulation means hiding internal details and exposing only the necessary parts of an object. This is usually done with private fields and public methods, which protect the data from being changed in unsafe ways. Inheritance allows a class to inherit properties and behavior from another class, so code can be reused instead of duplicated. For example, a GraduateStudent class can inherit from a Student class and add extra features such as research topic or thesis status. Polymorphism allows one method name to behave differently depending on the object type. Abstraction focuses on the essential behavior of an object while hiding the complex internal implementation details. This is often achieved through abstract classes and interfaces. These four principles form the heart of object-oriented design and are commonly tested in exams.`,
        concepts: `Java is a class-based, object-oriented language, and a strong understanding of classes, objects, methods, constructors, and access modifiers is essential. A constructor is a special method used to initialize an object when it is created. Instance variables store the object's state, and methods define what the object can do. Access modifiers such as private, public, protected, and default determine where a member can be accessed. Encapsulation is enforced by making fields private and exposing controlled methods. Method overloading allows multiple methods with the same name but different parameters, while method overriding allows a subclass to change or extend the behavior of a parent method. Interfaces define a contract that classes can implement, even if they do not share a common class hierarchy. This is very useful in large systems where multiple unrelated classes need to provide similar behavior.`,
        example: `A simple Java example is a Student class. It may contain private String name; private String email; private int score; and a public Student(String name, String email) constructor. It may also contain public void setScore(int score) { this.score = score; } and public int getScore() { return score; }. Then we can create an object with Student s = new Student("Alice", "alice@example.com");. This object stores the student's information and can be manipulated through methods. If we then create a GraduateStudent class that extends Student, it can inherit the common fields and methods while adding additional behavior such as thesisTopic. This demonstrates inheritance. If we declare a method printDetails() in the Student class and override it in GraduateStudent, the subclass can customize the output while still being treated as a Student. This is polymorphism in action.`,
        applications: `OOP is used across almost every large software system because it helps organize complexity. It is used in web applications, desktop programs, mobile apps, game engines, and enterprise software. In a project like this one, classes such as Student, Subject, Topic, Quiz, Question, and QuizAttempt model real-world entities. When these entities are represented as objects, the application becomes easier to understand and maintain. OOP also supports code reuse, testing, and scalability. For example, a Quiz class can manage quiz logic, a Question class can hold the question text and answer choices, and a Student class can hold information about the student. Each class has a clear responsibility. This is the basis of clean software design and helps reduce bugs by separating concerns.`,
        mistakes: `A common beginner mistake is thinking that a class is automatically an object. In Java, you must create an object using the new keyword. Another common mistake is using inheritance for the wrong reason; it should represent a real is-a relationship, not just a shortcut for reusing code. Another issue is forgetting to use encapsulation and exposing fields directly, which makes the program harder to control and more fragile. Students often confuse method overloading with method overriding, and this can lead to incorrect method behavior. Another bad habit is designing classes with too many responsibilities, which violates the principle of single responsibility. Good OOP design means each class should be focused, understandable, and able to interact with other classes in a predictable way.`,
        extra: `The best way to understand OOP is to think of classes as blueprints and objects as actual instances. Start by designing the real-world entities in your problem. Ask what data they need, what actions they should be able to perform, and how they relate to other objects. Once you can model those ideas clearly, the rest of Java becomes much more manageable. In examinations, be prepared to explain not just the syntax of OOP but also its purpose: to make systems modular, reusable, and easier to maintain.`
    },
    HTML: {
        title: 'HTML and Web Fundamentals',
        overview: `HTML stands for HyperText Markup Language. It is the basic language used to structure content on the web. At the most basic level, HTML tells the browser what content should appear on the page and in what order. It is different from CSS and JavaScript: CSS handles styling, while JavaScript handles behavior and interactivity. HTML gives the page its structure, like the skeleton of a building. For example, HTML tells the browser that some text is a heading, some is a paragraph, some is a link, and some is a form field. These building blocks are called elements.`,
        foundations: `Every HTML document contains elements enclosed within tags. A basic tag might look like <h1>Hello</h1>, where <h1> is the opening tag, Hello is the content, and </h1> is the closing tag. Some tags are self-closing or empty, such as <img> and <br>. Common HTML elements include h1 to h6 for headings, p for paragraphs, a for links, img for images, ul and ol for lists, table for tabular data, form for user input, and button for actions. Attributes provide extra information about an element. For example, href in an anchor tag tells where the link goes, and src in an image tag tells the browser where the image file is. The alt attribute provides alternative text for accessibility. HTML5 also introduced semantic tags such as header, nav, main, section, article, footer, and aside to make pages easier for browsers and assistive technologies to interpret.`,
        concepts: `A solid understanding of HTML depends on the idea that structure creates meaning. Headings organize content into a hierarchy, paragraphs hold descriptive text, links connect pages, and forms collect user input. Semantic elements are especially important because they communicate intent. For example, a nav element tells the browser that the content is navigation, and a main element tells it this is the central content of the page. The browser and screen readers use this structure to improve accessibility. HTML also works together with CSS and JavaScript. CSS controls appearance such as colors, layout, margins, and fonts, while JavaScript handles interactions like clicking buttons, showing messages, or updating content dynamically. Without enough HTML structure, a page becomes difficult to read and use.`,
        example: `A simple page might look like this: <header><nav><a href='/home'>Home</a></nav></header><main><h1>Welcome to ExamPrep</h1><p>Prepare smarter with adaptive quizzes.</p><button>Start Quiz</button></main><footer>2026 ExamPrep</footer>. This structure clearly communicates the page layout. The header contains the top navigation, the main content is the central information, and the footer contains closing information. Another example is an image tag: <img src='logo.png' alt='ExamPrep logo'>. The alt text helps users who cannot see the image understand what it represents. These examples show that HTML is not only about displaying content; it is about organizing meaning and making web pages accessible and understandable.`,
        applications: `HTML is used in every web page, from simple blog posts to large university portals and online learning platforms. It is the foundation of interfaces such as login pages, dashboards, product pages, forms, and quiz screens. In this project, HTML is what builds the pages used for student login, quiz selection, topic choices, and results. Without HTML, there would be no structure for the browser to display. HTML is essential for front-end development because it provides the layout and content that CSS and JavaScript enhance. A page built with proper HTML structure is more maintainable, more accessible, and easier for search engines to understand.`,
        mistakes: `Common beginner mistakes include using headings only for visual size instead of for semantic meaning, relying too much on generic div tags instead of meaningful elements, forgetting alt text for images, and not labeling form fields clearly. Another issue is placing elements in the wrong order, which can confuse the page structure and reduce readability. If a form field is not labeled correctly, users may not know what to enter, and assistive technologies may struggle to interpret it. Another common mistake is using a link when a button is needed or vice versa. The core idea is that HTML should describe the page structure clearly and logically. The appearance comes later from CSS, not from raw HTML tags alone.`,
        extra: `The easiest way to remember HTML is to think of it as the skeleton of a webpage. It gives the content its structure and meaning. CSS is the skin and styling, while JavaScript is the muscle that makes things move. In exams, remember that HTML is about structure and accessibility, not just appearance. Websites are used by people, not just by browsers, so semantic and well-organized HTML is essential in professional web development.`
    }
};

function getTopicExplanation(topic) {
    return topicExplanations[topic] || {
        title: `${topic} Fundamentals`,
        overview: `${topic} is a core part of ${currentSubject}. Think of it as a tool that helps you understand, design, analyze, or solve problems in this subject. Start with the meaning of the topic, the problem it solves, and the vocabulary used to describe it. Do not try to memorize isolated answers first. A strong understanding comes from connecting the definition to a simple example and then observing how the idea behaves in a real system.`,
        foundations: `First learn the basic definition of ${topic}, its purpose, its main components, and the conditions under which it is used. Write down each important term in your own words. Then identify what enters the process, what happens inside it, and what result is produced. This input-process-output view is useful for both theoretical and engineering topics. Review the basic rule until you can explain it without looking at your notes.`,
        concepts: `After learning the foundation, divide ${topic} into smaller concepts and study one relationship at a time. Compare it with similar ideas so that you know when to use one and not the other. Pay attention to assumptions, limitations, advantages, disadvantages, and common variations. For exam questions, underline the condition in the question before choosing an answer. A correct answer depends not only on remembering a definition but also on recognizing which concept fits the situation.`,
        example: `For a worked example, begin by stating the problem clearly. Next identify the known information, choose the relevant rule or method, and apply it one step at a time. After reaching an answer, check whether it is reasonable and explain why it makes sense. If the question changes one condition, repeat the process instead of copying the previous answer. This method develops understanding and prepares you for application-based questions.`,
        applications: `${topic} is useful because it connects classroom theory to practical engineering and software systems. It may be used to design a solution, organize information, analyze performance, predict behavior, control a process, or communicate technical decisions. When revising, connect the topic to one real application in ${currentSubject}. That connection helps you remember the idea and recognize how it appears in unfamiliar exam questions.`,
        mistakes: `Common mistakes include confusing the definition with an example, ignoring conditions, mixing up similar terms, and memorizing a procedure without understanding why it works. Students also lose marks by skipping units, assumptions, diagrams, or intermediate reasoning when those details are required. To correct this, explain the topic aloud, solve one easy example, solve one changed example, and review every wrong answer by asking which concept was misunderstood.`,
        extra: `Use this revision sequence: define the topic in one sentence, list its components, draw or describe the process, solve a basic example, compare it with a related concept, and finally answer practice questions without notes. Re-attempt the quiz only after you can explain the reason behind each corrected answer. This turns the result into learning rather than simple answer memorization.`
    };
}

function shuffleQuestions(items) {
    const cloned = [...items];
    for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
}

async function loadQuestionsForLevel(level, subjectName, topicName) {
    try {
        const response = await apiFetch(`/api/quizzes/${currentQuizId}/questions?studentId=${currentStudent.id}`);
        if (!response.ok) throw new Error("Quiz questions API unavailable");
        return shuffleQuestions(await response.json());
    } catch (error) {
        console.log("Quiz-specific questions are unavailable.");
        return [];
    }
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add("active");
    }

    if (pageId === "profile") {
        updateProfile();
        updateProgress();
    }
}

async function loginStudent(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
        const response = await apiFetch("/api/students/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Login failed");
            return;
        }

        currentStudent = { id: data.studentId, name: data.name, email: data.email };
        saveSession();
        showPage("dashboard");
    } catch (error) {
        alert("Could not connect to backend. Please make sure the server is running.");
    }
}

async function registerStudent(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    try {
        const response = await apiFetch("/api/students/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Registration failed");
            return;
        }

        currentStudent = { id: data.studentId, name: data.name, email: data.email };
        saveSession();
        showPage("dashboard");
    } catch (error) {
        alert("Could not connect to backend. Please make sure the server is running.");
    }
}

function renderSubjects(subjects) {
    const container = document.getElementById("subjectContainer");
    container.innerHTML = "";

    if (!subjects.length) {
        container.innerHTML = "<p class=\"empty-state\">No subjects match your search.</p>";
        return;
    }

    subjects.forEach(subject => {
        const card = document.createElement("div");
        card.className = "subject-card";

        card.innerHTML = `<h2>${subject}</h2>`;

        card.onclick = () => loadTopics(subject);
        container.appendChild(card);
    });
}

function renderResourceCards(containerId, subjects, buttonText, action) {
    const container = document.getElementById(containerId);
    container.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <div class="subject-icon">${subjectIcons[subject] || "📘"}</div>
            <h2>${subject}</h2>
            <p>${subjectDescriptions[subject] || "Explore this subject through guided learning and practice."}</p>
            <button data-subject="${subject}">${buttonText}</button>
        </div>
    `).join("");

    container.querySelectorAll("button").forEach(button => {
        button.onclick = () => action(button.dataset.subject);
    });
}

function renderResourcePages() {
    renderResourceCards("materialSubjectContainer", subjectNames, "Open Materials", loadStudyTopics);
    renderResourceCards("practiceSubjectContainer", subjectNames, "Practice", loadTopics);
    renderResourceCards("mockSubjectContainer", subjectNames, "Start Mock Test", startMockTest);
}

async function loadStudyTopics(subject) {
    currentSubject = subject;
    try {
        const response = await apiFetch(`/api/topics/subject/${encodeURIComponent(subject)}`);
        if (!response.ok) throw new Error("Topics API unavailable");
        const topics = await response.json();
        const container = document.getElementById("materialTopicContainer");
        container.innerHTML = topics.map(topic => {
            const explanation = getTopicExplanation(topic.topicName);
            return `
                <article class="material-card">
                    <h2>${explanation.title}</h2>
                    <h3>What This Topic Means</h3>
                    <p>${explanation.overview}</p>
                    <h3>Foundations</h3>
                    <p>${explanation.foundations}</p>
                    <h3>Key Concepts</h3>
                    <p>${explanation.concepts}</p>
                    <button data-topic-id="${topic.topicId}">Open Topic Quizzes</button>
                </article>
            `;
        }).join("");

        container.querySelectorAll("button").forEach(button => {
            const topic = topics.find(item => String(item.topicId) === button.dataset.topicId);
            button.onclick = () => loadQuizLevels(topic);
        });
    } catch (error) {
        document.getElementById("materialTopicContainer").innerHTML =
            "<p class=\"empty-state\">Study materials are unavailable while the backend is offline.</p>";
    }
}

async function startMockTest(subject) {
    currentSubject = subject;
    try {
        const topicResponse = await apiFetch(`/api/topics/subject/${encodeURIComponent(subject)}`);
        if (!topicResponse.ok) throw new Error("Topics unavailable");
        const topics = await topicResponse.json();
        if (!topics.length) throw new Error("No topics available");

        currentTopic = topics[0];
        const quizResponse = await apiFetch(`/api/quizzes/subject/${encodeURIComponent(subject)}/topic/${currentTopic.topicId}?studentId=${currentStudent.id}`);
        if (!quizResponse.ok) throw new Error("Mock tests unavailable");
        const quizzes = await quizResponse.json();
        const unlockedQuiz = quizzes.find(quiz => quiz.unlocked);
        if (!unlockedQuiz) throw new Error("No unlocked mock test");
        await startQuiz(unlockedQuiz);
    } catch (error) {
        alert("No mock test is available for this subject yet.");
    }
}

function fuzzySubjectScore(subject, searchTerm) {
    const normalizedSubject = subject.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedSearch = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!normalizedSearch) return 1;
    if (normalizedSubject.includes(normalizedSearch)) return 1;

    let searchIndex = 0;
    for (const character of normalizedSubject) {
        if (character === normalizedSearch[searchIndex]) {
            searchIndex++;
        }
        if (searchIndex === normalizedSearch.length) return 0.8;
    }

    let distance = normalizedSubject.length;
    const previousRow = Array.from({ length: normalizedSearch.length + 1 }, (_, index) => index);

    for (let subjectIndex = 1; subjectIndex <= normalizedSubject.length; subjectIndex++) {
        const currentRow = [subjectIndex];
        for (let searchIndex = 1; searchIndex <= normalizedSearch.length; searchIndex++) {
            const substitutionCost = normalizedSubject[subjectIndex - 1] === normalizedSearch[searchIndex - 1] ? 0 : 1;
            currentRow[searchIndex] = Math.min(
                currentRow[searchIndex - 1] + 1,
                previousRow[searchIndex] + 1,
                previousRow[searchIndex - 1] + substitutionCost
            );
        }
        distance = currentRow[normalizedSearch.length];
        for (let index = 0; index < currentRow.length; index++) {
            previousRow[index] = currentRow[index];
        }
    }

    return 1 - distance / Math.max(normalizedSubject.length, normalizedSearch.length);
}

function fuzzyFilterSubjects(subjects, searchTerm) {
    if (!searchTerm.trim()) return subjects;

    return subjects
        .map(subject => ({ subject, score: fuzzySubjectScore(subject, searchTerm) }))
        .filter(item => item.score >= 0.45)
        .sort((first, second) => second.score - first.score)
        .map(item => item.subject);
}

async function loadTopics(subject) {
    if (!currentStudent) {
        alert("Please log in before starting a quiz.");
        showPage("login");
        return;
    }

    currentSubject = subject;
    try {
        const response = await apiFetch(`/api/topics/subject/${encodeURIComponent(subject)}`);
        if (!response.ok) throw new Error("Topics API unavailable");
        const topics = await response.json();
        const container = document.getElementById("topicContainer");
        container.innerHTML = "";
        document.getElementById("topicHeading").innerText = `${subject} Topics`;

        topics.forEach(topic => {
            const card = document.createElement("div");
            card.className = "subject-card";
            card.innerHTML = `<div class="subject-icon">📘</div><h2>${topic.topicName}</h2><p>Five quizzes with gradually increasing difficulty.</p><button>Select Topic</button>`;
            card.querySelector("button").onclick = () => loadQuizLevels(topic);
            container.appendChild(card);
        });
        showPage("topics");
    } catch (error) {
        alert("Could not load topics for this subject.");
    }
}

async function loadQuizLevels(topic) {
    currentTopic = topic;
    const response = await apiFetch(`/api/quizzes/subject/${encodeURIComponent(currentSubject)}/topic/${topic.topicId}?studentId=${currentStudent.id}`);
    if (!response.ok) {
        alert("Could not load quiz levels.");
        return;
    }

    currentQuizCatalog = await response.json();
    document.getElementById("levelHeading").innerText = `${currentTopic.topicName} Quiz Levels`;
    const container = document.getElementById("quizLevelContainer");
    container.innerHTML = "";

    currentQuizCatalog.forEach(quiz => {
        const card = document.createElement("div");
        card.className = "subject-card";
        card.innerHTML = `<div class="subject-icon">${quiz.unlocked ? "▶️" : "🔒"}</div><h2>Level ${quiz.level}</h2><p>${quiz.difficulty} difficulty${quiz.unlocked ? " - unlocked" : " - pass the previous level with 75%"}</p><button ${quiz.unlocked ? "" : "disabled"}>${quiz.unlocked ? "Start Quiz" : "Locked"}</button>`;
        if (quiz.unlocked) {
            const beginQuiz = () => startQuiz(quiz);
            card.onclick = beginQuiz;
            card.querySelector("button").onclick = event => {
                event.stopPropagation();
                beginQuiz();
            };
        }
        container.appendChild(card);
    });
    showPage("quizLevels");
}

async function loadSubjects() {
    try {
        const response = await apiFetch("/api/subjects");

        if (!response.ok) throw new Error("API unavailable");

        const data = await response.json();
        const liveSubjects = data.map(s => s.subjectName);
        subjectNames = [...new Set([...liveSubjects, ...fallbackSubjects])];
        renderSubjects(subjectNames);
    } catch (error) {
        console.log("Backend unavailable. Using the built-in subject catalog.");
        subjectNames = fallbackSubjects;
        renderSubjects(subjectNames);
    }
}

async function startQuiz(quiz) {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    quizReview = [];
    currentQuizId = quiz.quizId;
    currentLevel = quiz.level;

    try {
        const questions = await loadQuestionsForLevel(currentLevel, currentSubject, currentTopic.topicName);
        currentQuizQuestions = questions.map(q => ({
            question: q.questionText,
            options: q.options
                .sort((a, b) => a.optionNumber - b.optionNumber)
                .filter((option, index, options) => options.findIndex(item => item.optionNumber === option.optionNumber) === index)
                .slice(0, 4)
                .map(opt => opt.optionText),
            answer: q.correctOption - 1,
            topic: q.topic?.topicName || currentTopic.topicName,
            difficulty: q.difficulty || "EASY"
        }));

        if (!currentQuizQuestions.length) {
            throw new Error("No questions found");
        }
    } catch (error) {
        console.log("Fallback to sample questions");
        currentQuizQuestions = (sampleQuizzes[currentSubject] || []).slice(0, Math.min(5, (sampleQuizzes[currentSubject] || []).length));
    }

    if (!currentQuizQuestions.length) {
        alert("Questions for this subject are not available yet.");
        return;
    }

    document.getElementById("quizTitle").innerText = `${currentSubject} / ${currentTopic.topicName} - Level ${currentLevel}`;
    showPage("quiz");
    loadQuestion();
}

function loadQuestion() {
    const q = currentQuizQuestions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        `Question ${currentQuestion + 1} of ${currentQuizQuestions.length}`;

    document.getElementById("question").innerText = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    selectedAnswer = null;

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerText = option;

        div.onclick = () => {
            document.querySelectorAll(".option").forEach(item => {
                item.classList.remove("selected");
            });

            div.classList.add("selected");
            selectedAnswer = index;
        };

        optionsDiv.appendChild(div);
    });
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Please select an answer.");
        return;
    }

    const question = currentQuizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.answer;

    quizReview.push({
        question: question.question,
        options: question.options,
        selectedAnswer: selectedAnswer,
        correctAnswer: question.answer,
        isCorrect: isCorrect
    });

    if (isCorrect) score++;

    currentQuestion++;

    if (currentQuestion < currentQuizQuestions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function getAnswerExplanation(item) {
    const correctAnswer = item.options[item.correctAnswer];
    const selectedAnswerText = item.options[item.selectedAnswer] || "No answer selected";

    if (item.isCorrect) {
        return `Correct. "${correctAnswer}" is the right answer because it matches the definition and reasoning required by this ${currentTopic.topicName} question.`;
    }

    return `"${selectedAnswerText}" is not correct for this question. The correct answer is "${correctAnswer}" because it matches the relevant ${currentTopic.topicName} rule or concept. Review the explanation above and compare the two choices before retrying.`;
}

function finishQuiz() {
    const percentage = Math.round((score / currentQuizQuestions.length) * 100);

    previousScore = currentScore;
    currentScore = percentage;
    quizCount++;

    saveAttempt(percentage);

    weakTopic = percentage < 75
        ? currentQuizQuestions[0].topic
        : "None";

    document.getElementById("finalScore").innerText = percentage + "%";

    const answerReviewHTML = quizReview.map((item, index) => `
            <div class="review-item" style="margin-bottom:12px; border-left:3px solid #ff8a65; padding-left:10px;">
                <p><strong>Question ${index + 1}:</strong> ${item.question}</p>
                <p><strong>Your answer:</strong> ${item.options[item.selectedAnswer] || "No answer selected"}</p>
                <p><strong>Correct answer:</strong> ${item.options[item.correctAnswer]}</p>
                <p><strong>Why:</strong> ${getAnswerExplanation(item)}</p>
            </div>
        `).join("");

    if (percentage < 75) {
        document.getElementById("resultMessage").innerText =
            "You scored below 75%. You need more practice and a revision recommendation.";

        document.getElementById("weakArea").innerHTML =
            `<strong>Weak Topic:</strong> ${weakTopic}`;

        const explanation = getTopicExplanation(weakTopic);
        document.getElementById("studyMaterial").innerHTML = `
            <h3>${explanation.title}</h3>
            <h4>What This Topic Means</h4>
            <p>${explanation.overview}</p>
            <h4>Foundations</h4>
            <p>${explanation.foundations}</p>
            <h4>Key Concepts</h4>
            <p>${explanation.concepts}</p>
            <h4>Worked Example</h4>
            <p>${explanation.example}</p>
            <h4>Where It Is Used</h4>
            <p>${explanation.applications}</p>
            <h4>Common Mistakes</h4>
            <p>${explanation.mistakes}</p>
            <h4>How to Revise Before Retrying</h4>
            <p>${explanation.extra || "Review the definitions, explain the key concepts aloud, and practise the missed question types before retrying."}</p>
            <h4>Answer Review and Corrections</h4>
            ${answerReviewHTML}
        `;

        const retryButton = document.querySelectorAll("#result button")[0];
        retryButton.textContent = "Retry This Quiz";
    } else {
        document.getElementById("resultMessage").innerText =
            "Excellent! You passed the threshold. You can continue to a harder quiz.";

        document.getElementById("weakArea").innerHTML =
            "No major weak areas detected.";

        document.getElementById("studyMaterial").innerHTML = `
            <h3>🎯 Next Step</h3>
            <p>Your score is at least 75%. You are ready to continue with a more difficult quiz.</p>
            <h4>Answer Review</h4>
            ${answerReviewHTML}
        `;

        const retryButton = document.querySelectorAll("#result button")[0];
        retryButton.textContent = currentLevel < 5 ? "Continue to Next Level" : "Choose Another Topic";
    }

    showPage("result");
}

function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    quizReview = [];
    showPage("quiz");
    loadQuestion();
}

async function saveAttempt(percentage) {
    try {
        const response = await apiFetch("/api/quizzes/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: currentStudent.id,
                quizId: currentQuizId,
                score,
                totalQuestions: currentQuizQuestions.length
            })
        });
        if (!response.ok) throw new Error(`Attempt save failed (${response.status})`);
    } catch (error) {
        console.error("Could not save quiz attempt", error);
    }
}

function continueToNextLevel() {
    const nextQuiz = currentQuizCatalog.find(quiz => quiz.level === currentLevel + 1);
    if (nextQuiz) {
        startQuiz(nextQuiz);
    } else {
        showPage("topics");
    }
}

function continueToHardQuiz() {
    if (currentScore === null || currentScore < 75) {
        alert("You need at least 75% to unlock the next difficulty level.");
        return;
    }

    currentDifficulty = "HARD";
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;

    document.getElementById("quizTitle").innerText = `${currentSubject} Quiz - Hard`;
    showPage("quiz");

    apiFetch(`/api/questions/subject/${encodeURIComponent(currentSubject)}?difficulty=HARD`)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(questions => {
            currentQuizQuestions = questions.slice(0, 10).map(q => ({
                question: q.questionText,
                options: q.options
                    .sort((a, b) => a.optionNumber - b.optionNumber)
                    .filter((option, index, options) => options.findIndex(item => item.optionNumber === option.optionNumber) === index)
                    .slice(0, 4)
                    .map(opt => opt.optionText),
                answer: q.correctOption - 1,
                topic: q.topic?.topicName || "General"
            }));

            if (!currentQuizQuestions.length) {
                alert("No hard quiz questions are available yet.");
                return;
            }

            loadQuestion();
        })
        .catch(() => {
            alert("No hard difficulty questions are available yet for this subject.");
        });
}

function updateDashboard() {
    document.getElementById("averageScore").innerText =
        currentScore !== null ? currentScore + "%" : "--%";

    document.getElementById("quizCount").innerText = quizCount;
    document.getElementById("weakTopic").innerText = weakTopic;

    if (currentScore !== null && currentScore < 75) {
        document.getElementById("recommendationText").innerText =
            `Your score is below 75%. Review ${weakTopic} and retry the basic quiz.`;
    } else if (currentScore !== null) {
        document.getElementById("recommendationText").innerText =
            "Good performance! You may continue to the next difficulty level.";
    }
}

async function updateProgress() {
    document.getElementById("previousScore").innerText =
        previousScore !== null ? previousScore + "%" : "--%";

    document.getElementById("currentScore").innerText =
        currentScore !== null ? currentScore + "%" : "--%";

    if (previousScore !== null && currentScore !== null) {
        document.getElementById("improvement").innerText =
            (currentScore - previousScore) + "%";
    } else {
        document.getElementById("improvement").innerText = "--%";
    }

    if (!currentStudent) return;

    try {
        const response = await apiFetch(`/api/quizzes/attempts?studentId=${currentStudent.id}`);
        if (!response.ok) throw new Error("Progress API unavailable");

        const attempts = await response.json();
        const subjects = new Map(subjectNames.map(subjectName => [subjectName, {
            attempts: 0,
            quizzes: new Set(),
            bestScore: 0,
            latestScore: null,
            levels: new Set()
        }]));

        attempts.forEach(attempt => {
            if (!subjects.has(attempt.subject)) {
                subjects.set(attempt.subject, {
                    attempts: 0,
                    quizzes: new Set(),
                    bestScore: 0,
                    latestScore: 0,
                    levels: new Set()
                });
            }

            const subject = subjects.get(attempt.subject);
            subject.attempts++;
            subject.quizzes.add(attempt.quizName);
            subject.levels.add(attempt.level);
            subject.bestScore = Math.max(subject.bestScore, attempt.percentage);
            subject.latestScore = attempt.percentage;
        });

        document.getElementById("subjectsStarted").innerText = subjects.size;
        document.getElementById("quizzesAttempted").innerText = attempts.length;

        const container = document.getElementById("subjectProgressContainer");
        if (!subjects.size) {
            container.innerHTML = "<p class=\"empty-state\">Complete a quiz to see subject progress.</p>";
            return;
        }

        container.innerHTML = [...subjects.entries()].map(([name, subject]) => `
            <div class="subject-progress-row">
                <div class="subject-progress-main">
                    <h3>${name}</h3>
                    <p>${subject.attempts} attempt(s) across ${subject.quizzes.size} quiz(es) · ${subject.levels.size} level(s) reached</p>
                    <div class="progress-track"><div class="progress-fill" style="width:${subject.bestScore}%"></div></div>
                </div>
                <div class="progress-score">
                    <strong>Best: ${subject.bestScore}%</strong>
                    <span>Latest: ${subject.latestScore === null ? "--" : subject.latestScore + "%"}</span>
                </div>
            </div>
        `).join("");
    } catch (error) {
        document.getElementById("subjectsStarted").innerText = "--";
        document.getElementById("quizzesAttempted").innerText = "--";
        document.getElementById("subjectProgressContainer").innerHTML =
            "<p class=\"empty-state\">Progress is temporarily unavailable.</p>";
    }
}

function updateProfile() {
    if (!currentStudent) return;

    document.getElementById("profileName").innerText = currentStudent.name;
    document.getElementById("profileEmail").innerText = currentStudent.email;
}

function logout() {
    currentStudent = null;
    saveSession();
    currentScore = null;
    previousScore = null;
    quizCount = 0;
    weakTopic = "None";
    showPage("login");
    document.getElementById("loginForm").reset();
    document.getElementById("registerForm").reset();
}

document.getElementById("loginForm").addEventListener("submit", loginStudent);
document.getElementById("registerForm").addEventListener("submit", registerStudent);

const resultButtons = document.querySelectorAll("#result button");
if (resultButtons.length > 0) {
    resultButtons[0].onclick = () => {
        const buttonText = resultButtons[0].textContent.trim();

        if (buttonText === "Continue to Next Level") {
            continueToNextLevel();
        } else if (buttonText === "Choose Another Topic") {
            showPage("topics");
        } else {
            retryQuiz();
        }
    };
}

const hasSavedSession = restoreSession();

if (hasSavedSession && currentStudent) {
    const dashboardTitle = document.getElementById("dashboard")?.querySelector(".welcome h1");
    if (dashboardTitle) {
        dashboardTitle.innerText = `Welcome to ExamPrep 👋 ${currentStudent.name}`;
    }
    showPage("dashboard");
} else {
    showPage("login");
}

subjectNames = fallbackSubjects;
renderSubjects(subjectNames);
document.getElementById("subjectSearch").addEventListener("input", event => {
    renderSubjects(fuzzyFilterSubjects(subjectNames, event.target.value));
});
loadSubjects();
