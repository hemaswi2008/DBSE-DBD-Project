let currentSubject = "";
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
let currentQuizNumber = 1;
let selectedAnswers = [];
const USED_QUESTION_KEY = "examprep_used_questions";
let usedQuestionIds = [];
try {
    usedQuestionIds = JSON.parse(localStorage.getItem(USED_QUESTION_KEY) || "[]");
    if (!Array.isArray(usedQuestionIds)) usedQuestionIds = [];
} catch (error) {
    localStorage.removeItem(USED_QUESTION_KEY);
}

const sampleQuizzes = {};
const SESSION_KEY = "examprep_student";

function saveSession() {
    if (currentStudent) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentStudent));
    }
}

function restoreSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return false;

    try {
        currentStudent = JSON.parse(stored);
        document.getElementById("dashboard").querySelector(".welcome h1").innerText = `Welcome to ExamPrep 👋 ${currentStudent.name}`;
        showPage("dashboard");
        return true;
    } catch (error) {
        localStorage.removeItem(SESSION_KEY);
        return false;
    }
}

function clearSession() {
    currentStudent = null;
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USED_QUESTION_KEY);
    usedQuestionIds = [];
}

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
        title: "SQL and Database Fundamentals",
        overview: "SQL, or Structured Query Language, is the standard language used to communicate with relational databases. A relational database stores information in tables. Each table contains rows, which represent records, and columns, which represent properties of those records.",
        foundations: "A primary key uniquely identifies each row. A foreign key stores a reference to a row in another table, creating a relationship between tables. For example, a student_id in an attempts table can refer to the student_id in the students table. This prevents disconnected or meaningless records.",
        concepts: "The SELECT command reads data. WHERE filters individual rows before grouping. GROUP BY combines rows with a common value, while HAVING filters the groups created by GROUP BY. ORDER BY sorts the final result. INSERT adds new records, UPDATE changes existing records, and DELETE removes records. JOIN combines related tables so information can be queried together.",
        example: "Suppose students contains name and score columns. SELECT name, score FROM students WHERE score >= 75 ORDER BY score DESC; returns only students who scored at least 75 and places the highest score first. A JOIN could then connect each student to their quiz attempts using student_id.",
        applications: "SQL is used for login records, student progress, product catalogs, banking transactions, reports, and almost every application that must store structured information. Database design also uses normalization to reduce repeated data and improve consistency.",
        mistakes: "WHERE is applied to rows, while HAVING is applied to groups. UPDATE and DELETE should normally include a WHERE condition, otherwise every row may be changed. Also remember that a foreign key points to another table, while a primary key identifies the current table's row."
    },
    OOP: {
        title: "Java Object-Oriented Programming",
        overview: "Object-oriented programming organizes software around objects. An object combines state, such as a student's name and score, with behavior, such as calculateGrade(). A class is the design or blueprint, while an object is a real instance created from that design.",
        foundations: "A constructor prepares a new object. Fields store its state and methods define what it can do. Encapsulation protects fields by keeping them private and exposing controlled public methods. This prevents unrelated code from changing an object's data incorrectly.",
        concepts: "The four major OOP ideas are encapsulation, inheritance, polymorphism, and abstraction. Inheritance allows a child class to reuse or specialize a parent class. Polymorphism allows the same method call to behave differently for different object types. Abstraction exposes important operations while hiding implementation details.",
        example: "Student student = new Student(); creates a Student object. The class can keep private String name and private int score fields, then provide getName(), setName(), and calculateGrade() methods. A GraduateStudent class could extend Student and add research information without rewriting all student behavior.",
        applications: "OOP is useful when an application contains many related entities, such as students, quizzes, questions, and attempts. Each entity can have its own data and rules, making a large program easier to test, extend, and maintain.",
        mistakes: "Declaring a class does not create an object; new creates an instance. Use extends for class inheritance and implements for interfaces. A private field is not directly accessible from unrelated classes. Also, inheritance should model a genuine is-a relationship rather than being used only to reuse a few lines of code."
    },
    HTML: {
        title: "HTML and Web Fundamentals",
        overview: "HTML, or HyperText Markup Language, defines the structure and meaning of a web page. The browser reads HTML elements and builds a document tree. That tree tells the browser which content is a heading, paragraph, link, image, form, list, navigation area, or main section.",
        foundations: "An element normally has an opening tag, content, and a closing tag. Attributes provide extra information, such as href on a link or src and alt on an image. Semantic elements such as header, nav, main, section, article, and footer describe the purpose of content and improve accessibility and search understanding.",
        concepts: "HTML provides structure, CSS controls presentation, and JavaScript controls behavior. Headings should follow a logical order. Forms should use labels and meaningful input types. Links navigate to another resource, while buttons perform an action on the current page. Images should include useful alternative text for users who cannot see them.",
        example: "<main><h1>ExamPrep</h1><p>Choose a subject to begin.</p><a href=\"subjects.html\">View subjects</a></main> creates a meaningful page structure. An image such as <img src=\"logo.png\" alt=\"ExamPrep logo\"> gives non-visual users a text description.",
        applications: "HTML is the foundation of login pages, dashboards, quiz screens, forms, documentation, and web applications. A well-structured HTML page can be styled by CSS, enhanced by JavaScript, and understood by assistive technologies.",
        mistakes: "Do not use headings only to make text look large; use CSS for appearance. Do not use a link when the action should be a button. Do not omit alt text from meaningful images, and remember that HTML provides structure while CSS and JavaScript handle visual styling and interaction."
    }
};

function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function questionTextWithoutVariant(item) {
    const text = item.questionText ?? item.question ?? item.text ?? JSON.stringify(item);
    return text
        .replace(/\s*[-–—:]?\s*(?:practice\s+)?variant\s+\d+\s*$/i, "")
        .trim()
        .replace(/\s+/g, " ");
}

function dedupeByIdAndText(items) {
    const unique = new Map();
    items.forEach(item => {
        const prompt = questionTextWithoutVariant(item);
        const key = prompt.toLocaleLowerCase();
        const existing = unique.get(key);
        const isVariant = /\s*[-–—:]?\s*(?:practice\s+)?variant\s+\d+\s*$/i.test(
            item.questionText ?? item.question ?? item.text ?? ""
        );
        const existingIsVariant = existing && /\s*[-–—:]?\s*(?:practice\s+)?variant\s+\d+\s*$/i.test(
            existing.questionText ?? existing.question ?? existing.text ?? ""
        );
        if (!existing || (existingIsVariant && !isVariant)) {
            unique.set(key, item);
        }
    });
    return Array.from(unique.values());
}

function getTopicExplanation(topic) {
    return topicExplanations[topic] || {
        title: `${topic} Fundamentals`,
        overview: `${topic} is a core concept in ${currentSubject}. It focuses on understanding the rules, patterns, and problem-solving methods behind the subject so you can explain and apply them in real situations.`,
        foundations: "Begin by learning the basic definitions, then connect them to how they work together in a practical example. If you understand the meaning behind each rule, it becomes easier to recognize the right approach in a quiz or exam.",
        concepts: "Break the topic into its main components: what it is, how it is used, and when it is appropriate. Practice explaining each concept in your own words before solving more difficult problems.",
        example: "Take one problem and solve it slowly: identify the inputs, decide which rule applies, perform each step carefully, and check whether the answer matches the requirement. This builds confidence and reduces mistakes.",
        applications: "These ideas appear in real developer work, assignments, practical labs, and exam questions. The more you connect theory to actual scenarios, the easier it becomes to remember and apply it under pressure.",
        mistakes: "A common mistake is memorizing a formula without understanding when it is valid. Always ask what the problem is asking, which concept fits the situation, and whether your final answer logically follows from the steps you used."
    };
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add("active");
    }

    if (pageId === "dashboard") updateDashboard();
    if (pageId === "progress") updateProgress();
}

async function loginStudent(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
        const response = await fetch("http://localhost:8080/api/students/login", {
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
        document.getElementById("dashboard").querySelector(".welcome h1").innerText = `Welcome to ExamPrep 👋 ${data.name}`;
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
        const response = await fetch("http://localhost:8080/api/students/register", {
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
        document.getElementById("dashboard").querySelector(".welcome h1").innerText = `Welcome to ExamPrep 👋 ${data.name}`;
        showPage("dashboard");
    } catch (error) {
        alert("Could not connect to backend. Please make sure the server is running.");
    }
}

function renderSubjects(subjects) {
    const container = document.getElementById("subjectContainer");
    container.innerHTML = "";

    subjects.forEach(subject => {
        const card = document.createElement("div");
        card.className = "subject-card";

        card.innerHTML = `
            <div class="subject-icon">${subjectIcons[subject] || "📘"}</div>
            <h2>${subject}</h2>
            <p>${subjectDescriptions[subject] || "Practice and improve your skills."}</p>
            <button>Start Quiz</button>
        `;

        card.querySelector("button").onclick = () => startQuiz(subject);
        container.appendChild(card);
    });
}

async function loadSubjects() {
    try {
        const response = await fetch("http://localhost:8080/api/subjects");

        if (!response.ok) throw new Error("API unavailable");

        const data = await response.json();
        subjectNames = data.map(s => s.subjectName);
        renderSubjects(subjectNames);
    } catch (error) {
        console.log("Backend unavailable. Using prototype subjects.");
        renderSubjects(Object.keys(sampleQuizzes));
    }
}

async function startQuiz(subject) {
    if (!currentStudent) {
        alert("Please log in before starting a quiz.");
        showPage("login");
        return;
    }

    const subjectPrefix = encodeURIComponent(subject);
    const generatedPrefixes = ["easy", "moderate", "hard"]
        .map(level => `generated-${level}-${subjectPrefix}-`);
    usedQuestionIds = usedQuestionIds.filter(id =>
        !generatedPrefixes.some(prefix => String(id).startsWith(prefix))
    );
    localStorage.setItem(USED_QUESTION_KEY, JSON.stringify(usedQuestionIds));
    await startSubjectQuiz(subject, 1);
}

async function startSubjectQuiz(subject, quizNumber) {
    const difficulty = quizNumber === 1 ? "EASY" : quizNumber === 2 ? "MODERATE" : "HARD";
    const questionPool = difficulty === "HARD"
        ? generateHardQuestions(subject).slice(0, 40)
        : generatePracticeQuestions(subject, difficulty);
    const usedIds = new Set(usedQuestionIds.map(String));
    const questions = shuffleArray(questionPool.filter(question => !usedIds.has(String(question.questionId))))
        .slice(0, 10);

    if (questions.length < 10) {
        alert(`The question set for ${subject} Quiz ${quizNumber} is unavailable.`);
        return;
    }

    currentSubject = subject;
    currentQuizNumber = quizNumber;
    currentDifficulty = difficulty;
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    selectedAnswers = [];
    currentQuizQuestions = questions.map(question => ({
        id: question.questionId,
        question: question.questionText,
        options: question.options
            .sort((a, b) => a.optionNumber - b.optionNumber)
            .map(option => option.optionText),
        answer: question.correctOption - 1,
        topic: question.topic?.topicName || "General"
    }));

    document.getElementById("quizTitle").innerText = `${subject} Quiz ${quizNumber}`;
    showPage("quiz");
    loadQuestion();
}

function getCompletedHardQuestionCount(subject) {
    const questionPrefix = `generated-hard-${encodeURIComponent(subject)}-`;
    return new Set(
        usedQuestionIds
            .map(String)
            .filter(id => id.startsWith(questionPrefix))
    ).size;
}

async function startNextHardQuiz(subject) {
    const nextQuizNumber = Math.max(3, currentQuizNumber + 1);
    if (nextQuizNumber > 6) {
        alert(`All six quizzes for ${subject} are completed.`);
        return;
    }
    await startSubjectQuiz(subject, nextQuizNumber);
}

function loadQuestion() {
    const q = currentQuizQuestions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        `Question ${currentQuestion + 1} of ${currentQuizQuestions.length}`;

    document.getElementById("question").innerText = q.question;
    selectedAnswer = selectedAnswers[currentQuestion] ?? null;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerText = option;
        if (selectedAnswer === index) {
            div.classList.add("selected");
        }

        div.onclick = () => {
            document.querySelectorAll(".option").forEach(item => {
                item.classList.remove("selected");
            });

            div.classList.add("selected");
            selectedAnswer = index;
            selectedAnswers[currentQuestion] = index;
        };

        optionsDiv.appendChild(div);
    });

    document.getElementById("previousQuestionButton").disabled = currentQuestion === 0;
    document.getElementById("nextQuestionButton").textContent =
        currentQuestion === currentQuizQuestions.length - 1 ? "Submit Quiz" : "Next";
}

function previousQuestion() {
    if (currentQuestion === 0) return;
    if (selectedAnswer !== null) {
        selectedAnswers[currentQuestion] = selectedAnswer;
    }
    currentQuestion--;
    loadQuestion();
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Please select an answer.");
        return;
    }

    const question = currentQuizQuestions[currentQuestion];
    selectedAnswers[currentQuestion] = selectedAnswer;
    if (currentQuestion === currentQuizQuestions.length - 1) {
        finishQuiz();
        return;
    }

    currentQuestion++;
    loadQuestion();
}

function finishQuiz() {
    score = currentQuizQuestions.reduce(
        (total, question, index) => total + (selectedAnswers[index] === question.answer ? 1 : 0),
        0
    );
    const percentage = Math.round((score / currentQuizQuestions.length) * 100);
    usedQuestionIds = [...new Set([...usedQuestionIds, ...currentQuizQuestions.map(q => q.id).filter(Boolean)])];
    localStorage.setItem(USED_QUESTION_KEY, JSON.stringify(usedQuestionIds));

    previousScore = currentScore;
    currentScore = percentage;
    quizCount++;

    const topicMistakes = {};
    currentQuizQuestions.forEach((question, index) => {
        if (selectedAnswers[index] !== question.answer) {
            topicMistakes[question.topic] = (topicMistakes[question.topic] || 0) + 1;
        }
    });

    const sortedWeakTopics = Object.entries(topicMistakes).sort((a, b) => b[1] - a[1]);
    weakTopic = percentage < 75
        ? (sortedWeakTopics[0]?.[0] || currentQuizQuestions[0]?.topic || "General")
        : "None";

    document.getElementById("finalScore").innerText = percentage + "%";

    const retryButton = document.querySelectorAll("#result button")[0];
    if (currentDifficulty === "HARD") {
        const completedRounds = Math.floor(getCompletedHardQuestionCount(currentSubject) / 10);
        const remainingQuestions = 40 - getCompletedHardQuestionCount(currentSubject);
        const isFinalQuiz = currentQuizNumber === 6;
        document.getElementById("resultMessage").innerText = percentage < 75
            ? "Review the topic below, then retry this Hard quiz. The same questions will appear in a different order, with your answers cleared."
            : (isFinalQuiz
                ? "You have completed all six quizzes for this subject."
                : "Great work! Continue to the next Hard quiz for 10 new questions.");
        document.getElementById("weakArea").innerHTML = percentage < 75
            ? `<strong>Weak Topic:</strong> ${weakTopic}`
            : "No major weak areas detected.";
        document.getElementById("studyMaterial").innerHTML = percentage < 75
            ? `<h3>Review ${weakTopic}</h3><p>Retry this quiz after reviewing the topic.</p>`
            : "<h3>🎯 Quiz complete</h3><p>Each Hard quiz uses a different set of questions.</p>";
        retryButton.textContent = percentage < 75
            ? "Retry Hard Quiz"
            : (isFinalQuiz ? "All 6 Quizzes Completed" : "Continue to Next Hard Quiz");
        retryButton.disabled = percentage >= 75 && (isFinalQuiz || remainingQuestions === 0);
    } else if (percentage < 75) {
        document.getElementById("resultMessage").innerText =
            "You scored below 75%. Review the topic below, then retry with the same questions in a different order.";

        document.getElementById("weakArea").innerHTML =
            `<strong>Weak Topic:</strong> ${weakTopic}`;

        const explanation = getTopicExplanation(weakTopic);
        document.getElementById("studyMaterial").innerHTML = `
            <div class="lesson-guide">
                <h3>${explanation.title}</h3>
                <div class="lesson-section">
                    <h4>1. Overview</h4>
                    <p>${explanation.overview}</p>
                </div>
                <div class="lesson-section">
                    <h4>2. Foundations</h4>
                    <p>${explanation.foundations}</p>
                </div>
                <div class="lesson-section">
                    <h4>3. Key Concepts</h4>
                    <p>${explanation.concepts}</p>
                </div>
                <div class="lesson-section">
                    <h4>4. Worked Example</h4>
                    <p>${explanation.example}</p>
                </div>
                <div class="lesson-section">
                    <h4>5. Practical Use</h4>
                    <p>${explanation.applications}</p>
                </div>
                <div class="lesson-section">
                    <h4>6. Common Mistakes</h4>
                    <p>${explanation.mistakes}</p>
                </div>
            </div>
        `;

        retryButton.textContent = "Take Retry Quiz";
        retryButton.disabled = false;
    } else {
        document.getElementById("resultMessage").innerText =
            `Excellent! You passed the ${currentDifficulty === "EASY" ? "Easy" : "Moderate"} quiz and unlocked the next level.`;

        document.getElementById("weakArea").innerHTML =
            "No major weak areas detected.";

        document.getElementById("studyMaterial").innerHTML = `
            <h3>🎯 Next Step</h3>
            <p>Your score is at least 75%. Continue to the next quiz level.</p>
        `;

        retryButton.textContent = currentQuizNumber === 1
            ? "Continue to Moderate Quiz"
            : "Continue to Hard Quiz";
        retryButton.disabled = false;
    }

    showPage("result");
}

function retryQuiz() {
    const previousFirstQuestion = currentQuizQuestions[0];
    const questionKey = question => question?.id ?? question?.question;
    currentQuizQuestions = shuffleArray(currentQuizQuestions);
    if (
        currentQuizQuestions.length > 1 &&
        questionKey(currentQuizQuestions[0]) === questionKey(previousFirstQuestion)
    ) {
        const replacementIndex = 1 + Math.floor(Math.random() * (currentQuizQuestions.length - 1));
        [currentQuizQuestions[0], currentQuizQuestions[replacementIndex]] =
            [currentQuizQuestions[replacementIndex], currentQuizQuestions[0]];
    }

    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    selectedAnswers = [];
    showPage("quiz");
    loadQuestion();
}

function continueToNextQuiz() {
    if (currentScore === null || currentScore < 75) {
        alert("You need at least 75% to unlock the next quiz.");
        return;
    }

    if (currentQuizNumber < 2) {
        startSubjectQuiz(currentSubject, currentQuizNumber + 1);
    } else {
        startNextHardQuiz(currentSubject);
    }
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

function updateProgress() {
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
}

function logout() {
    clearSession();
    currentScore = null;
    previousScore = null;
    quizCount = 0;
    weakTopic = "None";
    usedQuestionIds = [];
    showPage("login");
    document.getElementById("loginForm").reset();
    document.getElementById("registerForm").reset();
}

document.getElementById("loginForm").addEventListener("submit", loginStudent);
document.getElementById("registerForm").addEventListener("submit", registerStudent);

const resultButtons = document.querySelectorAll("#result button");
if (resultButtons.length > 0) {
    resultButtons[0].onclick = () => {
        if (currentScore !== null && currentScore >= 75 && currentQuizNumber < 6) {
            continueToNextQuiz();
        } else {
            retryQuiz();
        }
    };
}

renderSubjects(Object.keys(sampleQuizzes));
loadSubjects();

if (!restoreSession()) {
    showPage("login");
}
