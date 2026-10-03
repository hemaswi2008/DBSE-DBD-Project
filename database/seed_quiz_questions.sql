USE exam_prep_db;

DELETE qo FROM question_options qo
JOIN questions q ON q.question_id = qo.question_id
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
WHERE s.subject_name IN ('Database Systems', 'Java Programming', 'Web Development');

DELETE q FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
WHERE s.subject_name IN ('Database Systems', 'Java Programming', 'Web Development');

CREATE TEMPORARY TABLE quiz_seed (
    subject_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    correct_option INT NOT NULL,
    option_one TEXT NOT NULL,
    option_two TEXT NOT NULL,
    option_three TEXT NOT NULL,
    option_four TEXT NOT NULL
);

INSERT INTO quiz_seed VALUES
('Database Systems', 'SQL', 'Which SQL statement retrieves data?', 3, 'INSERT', 'UPDATE', 'SELECT', 'DELETE'),
('Database Systems', 'SQL', 'Which clause filters grouped rows?', 2, 'WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'),
('Database Systems', 'SQL', 'Which key uniquely identifies a row?', 1, 'Primary key', 'Foreign key', 'Candidate value', 'Index key'),
('Database Systems', 'SQL', 'Which command adds a new table?', 4, 'ADD TABLE', 'NEW TABLE', 'MAKE TABLE', 'CREATE TABLE'),
('Database Systems', 'SQL', 'What does normalization reduce?', 2, 'Security', 'Data redundancy', 'Query syntax', 'Network traffic'),
('Database Systems', 'SQL', 'Which join returns matching rows from both tables?', 1, 'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'SELF JOIN'),
('Database Systems', 'SQL', 'Which command changes existing rows?', 3, 'ALTER', 'INSERT', 'UPDATE', 'MODIFY'),
('Database Systems', 'SQL', 'What does COMMIT do?', 4, 'Cancels a query', 'Creates a table', 'Locks a database', 'Saves a transaction'),
('Database Systems', 'SQL', 'Which data type stores whole numbers?', 2, 'VARCHAR', 'INT', 'DATE', 'BOOLEAN'),
('Database Systems', 'SQL', 'Which clause sorts query results?', 1, 'ORDER BY', 'SORT BY', 'GROUP BY', 'ARRANGE BY'),
('Java Programming', 'OOP', 'Which Java keyword creates a new object?', 3, 'class', 'return', 'new', 'static'),
('Java Programming', 'OOP', 'Which method starts a Java application?', 1, 'main', 'start', 'run', 'init'),
('Java Programming', 'OOP', 'Which type stores true or false?', 4, 'int', 'char', 'String', 'boolean'),
('Java Programming', 'OOP', 'Which keyword inherits from a class?', 2, 'implements', 'extends', 'inherits', 'superclass'),
('Java Programming', 'OOP', 'Which collection does not allow duplicate values?', 1, 'Set', 'List', 'Queue', 'Map'),
('Java Programming', 'OOP', 'Which block handles an exception?', 3, 'if', 'catcher', 'catch', 'error'),
('Java Programming', 'OOP', 'Which keyword prevents inheritance?', 4, 'static', 'private', 'const', 'final'),
('Java Programming', 'OOP', 'Which type stores a sequence of characters?', 2, 'char', 'String', 'Text', 'CharacterArray'),
('Java Programming', 'OOP', 'Which access modifier gives the widest access?', 1, 'public', 'protected', 'default', 'private'),
('Java Programming', 'OOP', 'Which interface supports indexed access?', 3, 'Set', 'Map', 'List', 'Path'),
('Web Development', 'HTML', 'Which HTML tag defines a paragraph?', 1, '<p>', '<title>', '<h1>', '<div>'),
('Web Development', 'HTML', 'Which tag creates a hyperlink?', 4, '<link>', '<url>', '<href>', '<a>'),
('Web Development', 'HTML', 'Which CSS property changes text color?', 2, 'font', 'color', 'text-style', 'foreground'),
('Web Development', 'HTML', 'Which language adds behavior to a web page?', 3, 'HTML', 'CSS', 'JavaScript', 'SQL'),
('Web Development', 'HTML', 'Which HTTP method commonly retrieves data?', 1, 'GET', 'SEND', 'FETCH', 'READ'),
('Web Development', 'HTML', 'Which tag displays an image?', 2, '<image>', '<img>', '<picture-src>', '<src>'),
('Web Development', 'HTML', 'Which CSS layout uses rows and columns?', 4, 'Float', 'Block', 'Inline', 'Grid'),
('Web Development', 'HTML', 'Which HTML element contains page metadata?', 3, '<body>', '<main>', '<head>', '<meta-data>'),
('Web Development', 'HTML', 'Which status code means not found?', 1, '404', '200', '301', '500'),
('Web Development', 'HTML', 'Which JavaScript keyword declares a block variable?', 2, 'var', 'let', 'define', 'value');

INSERT INTO questions (topic_id, question_text, difficulty, correct_option)
SELECT t.topic_id, s.question_text, 'EASY', s.correct_option
FROM quiz_seed s
JOIN subjects sub ON sub.subject_name = s.subject_name
JOIN topics t ON t.topic_id = (
    SELECT MIN(t2.topic_id)
    FROM topics t2
    WHERE t2.subject_id = sub.subject_id AND t2.topic_name = s.topic_name
);

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 1, s.option_one
FROM questions q JOIN quiz_seed s ON s.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 2, s.option_two
FROM questions q JOIN quiz_seed s ON s.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 3, s.option_three
FROM questions q JOIN quiz_seed s ON s.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 4, s.option_four
FROM questions q JOIN quiz_seed s ON s.question_text = q.question_text;