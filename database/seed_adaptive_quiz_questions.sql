USE exam_prep_db;

-- Ensure the topics used by this seed exist, even on databases created from exam_prep_db.sql.
INSERT INTO topics (subject_id, topic_name)
SELECT s.subject_id, 'AI Basics'
FROM subjects s
WHERE s.subject_name = 'Artificial Intelligence'
  AND NOT EXISTS (
      SELECT 1 FROM topics t
      WHERE t.subject_id = s.subject_id AND t.topic_name = 'AI Basics'
  );

INSERT INTO topics (subject_id, topic_name)
SELECT s.subject_id, 'SQL'
FROM subjects s
WHERE s.subject_name = 'Database Systems'
  AND NOT EXISTS (
      SELECT 1 FROM topics t
      WHERE t.subject_id = s.subject_id AND t.topic_name = 'SQL'
  );

INSERT INTO topics (subject_id, topic_name)
SELECT s.subject_id, 'OOP'
FROM subjects s
WHERE s.subject_name = 'Java Programming'
  AND NOT EXISTS (
      SELECT 1 FROM topics t
      WHERE t.subject_id = s.subject_id AND t.topic_name = 'OOP'
  );

INSERT INTO topics (subject_id, topic_name)
SELECT s.subject_id, 'HTML'
FROM subjects s
WHERE s.subject_name = 'Web Development'
  AND NOT EXISTS (
      SELECT 1 FROM topics t
      WHERE t.subject_id = s.subject_id AND t.topic_name = 'HTML'
  );

-- Replace the AI sample pool and prior hard pools so rerunning this file stays idempotent.
DELETE qo FROM question_options qo
JOIN questions q ON q.question_id = qo.question_id
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
WHERE s.subject_name = 'Artificial Intelligence'
   OR (s.subject_name IN ('Database Systems', 'Java Programming', 'Web Development',
       'C Programming', 'Computer Networks', 'Data Structures', 'Discrete Mathematics',
       'Operating Systems', 'Python Programming', 'Robotics Engineering', 'Statistics')
       AND q.difficulty = 'HARD');

DELETE q FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
WHERE s.subject_name = 'Artificial Intelligence'
   OR (s.subject_name IN ('Database Systems', 'Java Programming', 'Web Development',
       'C Programming', 'Computer Networks', 'Data Structures', 'Discrete Mathematics',
       'Operating Systems', 'Python Programming', 'Robotics Engineering', 'Statistics')
       AND q.difficulty = 'HARD');

DROP TEMPORARY TABLE IF EXISTS adaptive_quiz_seed;
CREATE TEMPORARY TABLE adaptive_quiz_seed (
    subject_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    question_text TEXT NOT NULL,
    correct_option INT NOT NULL,
    option_one TEXT NOT NULL,
    option_two TEXT NOT NULL,
    option_three TEXT NOT NULL,
    option_four TEXT NOT NULL
);

INSERT INTO adaptive_quiz_seed VALUES
('Artificial Intelligence', 'AI Basics', 'EASY', 'What does AI stand for?', 1, 'Artificial Intelligence', 'Automated Internet', 'Applied Interaction', 'Algorithmic Input'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'Which approach learns from labeled examples?', 3, 'Clustering', 'Random search', 'Supervised learning', 'Sorting'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'Which approach groups unlabeled data?', 4, 'Supervised learning', 'Regression', 'Classification', 'Clustering'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'What is a model used to make?', 2, 'Tables', 'Predictions', 'Passwords', 'Backups'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'What is training data used for?', 3, 'Deleting models', 'Formatting disks', 'Learning patterns', 'Sending emails'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'What is a neural network inspired by?', 1, 'The human brain', 'A database', 'A router', 'A compiler'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'Which field enables computers to understand text?', 2, 'Computer graphics', 'Natural language processing', 'Operating systems', 'Cryptography'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'What does a robot sensor do?', 4, 'Deletes its program', 'Trains every model', 'Stores web pages', 'Collects information about its surroundings'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'What is an AI agent designed to do?', 1, 'Observe and act toward a goal', 'Only store files', 'Replace a database', 'Compile source code'),
('Artificial Intelligence', 'AI Basics', 'EASY', 'Which is an example of a classification task?', 3, 'Estimating tomorrow’s temperature', 'Grouping customers without labels', 'Labeling an email as spam or not spam', 'Compressing an image'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'A classifier performs well on training data but poorly on new examples. What is the most likely issue?', 2, 'Underflow', 'Overfitting', 'Encryption', 'Normalization'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'Which evaluation measure is the harmonic mean of precision and recall?', 4, 'Accuracy', 'Specificity', 'Mean squared error', 'F1 score'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'In a search tree, what does an admissible heuristic guarantee?', 1, 'It never overestimates the remaining cost', 'It always expands the deepest node', 'It finds every solution in constant time', 'It assigns identical costs to all paths'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'A model has high bias and low variance. Which change is most likely to help?', 3, 'Reduce the feature set further', 'Increase regularization', 'Use a more expressive model', 'Train on fewer examples'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'Why is a separate validation set used during model development?', 2, 'To replace the training labels', 'To compare model choices without using the final test set', 'To guarantee zero training error', 'To increase the number of classes'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'In gradient descent, what generally happens if the learning rate is far too large?', 4, 'The model becomes linear', 'The loss is guaranteed to be zero', 'The training set becomes balanced', 'Updates may overshoot and fail to converge'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'Which situation is an example of data leakage?', 1, 'A feature contains information only available after the outcome', 'A model uses a regularization penalty', 'The training set is shuffled', 'A feature is scaled using training statistics'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'What is the main purpose of cross-validation?', 3, 'To remove all noisy labels', 'To make a model deterministic', 'To estimate generalization across different data splits', 'To replace feature engineering'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'A dataset has 99% negative cases. Why can accuracy be misleading?', 2, 'Accuracy cannot be computed for binary classes', 'A model predicting only the majority class may still score highly', 'The minority class is automatically removed', 'Accuracy measures probability calibration only'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'What does regularization primarily encourage in many models?', 4, 'More training examples to be duplicated', 'All features to have identical values', 'Training error to increase without limit', 'Less complex solutions that reduce overfitting'),
('Artificial Intelligence', 'AI Basics', 'HARD', 'In reinforcement learning, what signal describes how desirable an action outcome is?', 1, 'Reward', 'Feature vector', 'Decision boundary', 'Confusion matrix'),
('Database Systems', 'SQL', 'HARD', 'A transaction transfers funds between two accounts. Which property ensures both updates happen or neither does?', 2, 'Isolation', 'Atomicity', 'Durability', 'Indexing'),
('Database Systems', 'SQL', 'HARD', 'Which normal form removes partial dependencies on part of a composite key?', 3, 'First normal form', 'Third normal form', 'Second normal form', 'Boyce-Codd normal form'),
('Database Systems', 'SQL', 'HARD', 'What is a phantom read?', 4, 'A transaction reads its own uncommitted update', 'A row disappears because of a rollback', 'A query reads a stale index page', 'Repeating a range query returns newly inserted matching rows'),
('Database Systems', 'SQL', 'HARD', 'Which index structure is commonly effective for equality and range lookups?', 1, 'B-tree', 'Heap file', 'Hash of the full table only', 'Unordered linked list'),
('Database Systems', 'SQL', 'HARD', 'Why can adding an index slow down INSERT operations?', 2, 'Indexes disable transactions', 'Each relevant index must also be maintained', 'An index changes the table schema', 'Indexes require every row to be locked permanently'),
('Database Systems', 'SQL', 'HARD', 'Which join preserves every row from the left table even when no right-side match exists?', 3, 'CROSS JOIN', 'INNER JOIN', 'LEFT OUTER JOIN', 'NATURAL JOIN'),
('Database Systems', 'SQL', 'HARD', 'What does a database deadlock describe?', 4, 'A query that returns no rows', 'A permanently missing primary key', 'An index with duplicate entries', 'Transactions waiting on resources held by one another'),
('Database Systems', 'SQL', 'HARD', 'Which clause filters groups after aggregate calculations?', 1, 'HAVING', 'WHERE', 'ORDER BY', 'LIMIT'),
('Database Systems', 'SQL', 'HARD', 'What is the main purpose of a foreign key constraint?', 2, 'To encrypt a column', 'To enforce referential integrity between related tables', 'To sort rows automatically', 'To make every value unique in the current table'),
('Database Systems', 'SQL', 'HARD', 'Under snapshot isolation, what does a transaction generally read?', 3, 'Only rows it inserted', 'The newest uncommitted values from every transaction', 'A consistent version of data from a defined point in time', 'A random version of each row'),
('Java Programming', 'OOP', 'HARD', 'Which statement about Java method overloading is correct?', 4, 'Methods must have different return types only', 'It is resolved only at runtime', 'It requires methods to belong to different classes', 'Methods share a name but differ in parameter lists'),
('Java Programming', 'OOP', 'HARD', 'What is the purpose of the volatile keyword for a field?', 1, 'It provides visibility guarantees for reads and writes across threads', 'It makes compound updates atomic', 'It prevents the field from being serialized', 'It allows the field to be overridden'),
('Java Programming', 'OOP', 'HARD', 'Which resource-management construct closes AutoCloseable resources automatically?', 2, 'synchronized block', 'try-with-resources', 'finalize method', 'static initializer'),
('Java Programming', 'OOP', 'HARD', 'Why should equals() and hashCode() be implemented consistently?', 3, 'To allow checked exceptions', 'To enable method overloading', 'Hash-based collections rely on equal objects having equal hash codes', 'To prevent inheritance'),
('Java Programming', 'OOP', 'HARD', 'What does the wildcard ? extends Number primarily allow?', 4, 'Adding arbitrary Number instances safely', 'Replacing Number with Object at runtime', 'Invoking constructors on the wildcard type', 'Reading values as Number while restricting writes'),
('Java Programming', 'OOP', 'HARD', 'Which description best matches a functional interface?', 1, 'An interface with one abstract method', 'An interface with no methods', 'A class with one constructor', 'An interface that cannot have default methods'),
('Java Programming', 'OOP', 'HARD', 'What is a common consequence of an unhandled exception in a thread?', 2, 'The exception is silently converted to null', 'That thread terminates after the exception escapes', 'The JVM always retries the failing statement', 'All other threads are automatically interrupted'),
('Java Programming', 'OOP', 'HARD', 'Which collection is generally appropriate for frequent membership tests with unique elements?', 3, 'ArrayList', 'LinkedList', 'HashSet', 'ArrayDeque'),
('Java Programming', 'OOP', 'HARD', 'What does the super keyword do inside a subclass constructor?', 4, 'Creates another subclass instance', 'Overrides the parent constructor', 'Makes the current object static', 'Invokes a superclass constructor'),
('Java Programming', 'OOP', 'HARD', 'What is the key distinction between checked and unchecked exceptions?', 1, 'Checked exceptions are subject to compile-time handling or declaration requirements', 'Unchecked exceptions cannot be thrown', 'Checked exceptions are always errors', 'Unchecked exceptions must always be caught'),
('Web Development', 'HTML', 'HARD', 'Why should a web application validate authorization on the server even if the UI hides restricted controls?', 2, 'Hidden controls are not rendered by browsers', 'Clients can modify requests and bypass presentation logic', 'Server-side checks make HTTPS unnecessary', 'CSS selectors enforce access control'),
('Web Development', 'HTML', 'HARD', 'Which HTTP status code is most appropriate when authentication is valid but permission is insufficient?', 3, '301', '401', '403', '404'),
('Web Development', 'HTML', 'HARD', 'What is the primary purpose of the Content-Security-Policy response header?', 4, 'To compress HTML responses', 'To select a CSS layout', 'To cache authenticated pages forever', 'To restrict the sources from which content may be loaded'),
('Web Development', 'HTML', 'HARD', 'Why is a parameterized SQL query safer than concatenating user input?', 1, 'It keeps input data separate from executable SQL syntax', 'It automatically encrypts the database', 'It blocks all network requests', 'It removes the need for authorization'),
('Web Development', 'HTML', 'HARD', 'Which browser storage mechanism is generally sent automatically with matching HTTP requests?', 2, 'sessionStorage', 'Cookies', 'IndexedDB', 'The JavaScript heap'),
('Web Development', 'HTML', 'HARD', 'What is the main benefit of using semantic HTML elements?', 3, 'They execute JavaScript faster', 'They replace the need for CSS', 'They communicate structure and meaning to browsers and assistive technology', 'They encrypt page content'),
('Web Development', 'HTML', 'HARD', 'What does CORS primarily control?', 4, 'Whether a browser accepts a password', 'How a server stores HTML files', 'Which CSS rules can be applied', 'Whether browser scripts may access cross-origin responses'),
('Web Development', 'HTML', 'HARD', 'Which practice helps prevent cross-site scripting when displaying user-provided text?', 1, 'Context-appropriate output encoding', 'Disabling database indexes', 'Using GET for every request', 'Hiding the form with CSS'),
('Web Development', 'HTML', 'HARD', 'What is the purpose of an idempotency key on a payment request?', 2, 'To encrypt the payment amount', 'To avoid processing the same logical request more than once', 'To make the request public', 'To bypass server-side validation'),
('Web Development', 'HTML', 'HARD', 'Which response header helps prevent MIME type sniffing?', 3, 'Location', 'ETag', 'X-Content-Type-Options: nosniff', 'Accept-Language'),
('C Programming', 'C Basics', 'HARD', 'What is undefined behavior in C?', 1, 'Behavior for which the C standard imposes no requirements', 'Behavior that must always print a warning', 'A runtime error that is automatically repaired', 'A function that returns an unspecified value'),
('C Programming', 'C Basics', 'HARD', 'What does the expression sizeof(array) / sizeof(array[0]) calculate when array is an actual array in scope?', 2, 'The number of bytes in one element', 'The number of elements in the array', 'The array capacity in bits', 'The address of the final element'),
('C Programming', 'C Basics', 'HARD', 'What is a dangling pointer?', 3, 'A pointer initialized to NULL', 'A pointer to a global variable', 'A pointer that refers to an object whose lifetime has ended', 'A pointer used only for reading'),
('C Programming', 'C Basics', 'HARD', 'Which allocation function returns zero-initialized storage?', 4, 'malloc', 'realloc', 'alloca', 'calloc'),
('C Programming', 'C Basics', 'HARD', 'What does pointer arithmetic on an int pointer advance by?', 1, 'The size of one int element', 'Exactly one byte in all cases', 'The size of the entire allocated array', 'The size of a memory page'),
('Computer Networks', 'Networking Basics', 'HARD', 'What is the main purpose of the TCP three-way handshake?', 2, 'Encrypting all application data', 'Establishing and synchronizing a TCP connection', 'Resolving a hostname to an IP address', 'Detecting the physical cable type'),
('Computer Networks', 'Networking Basics', 'HARD', 'A /27 IPv4 subnet contains how many usable host addresses under conventional subnetting?', 3, '16', '14', '30', '32'),
('Computer Networks', 'Networking Basics', 'HARD', 'Which DNS record type maps a hostname to an IPv6 address?', 4, 'A', 'CNAME', 'MX', 'AAAA'),
('Computer Networks', 'Networking Basics', 'HARD', 'What does a router primarily use to forward an IP packet?', 1, 'The destination IP address and routing table', 'The destination application password', 'The source process identifier', 'The HTML content type'),
('Computer Networks', 'Networking Basics', 'HARD', 'What problem does TCP congestion control primarily try to avoid?', 2, 'Duplicate hostnames', 'Overloading the network path with excessive traffic', 'Invalid encryption certificates', 'Exhausting DNS record types'),
('Data Structures', 'Fundamentals', 'HARD', 'What is the worst-case time complexity of searching an unbalanced binary search tree?', 3, 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)'),
('Data Structures', 'Fundamentals', 'HARD', 'Which data structure is commonly used to implement a priority queue efficiently?', 4, 'Stack', 'Unsorted linked list only', 'Disjoint-set forest', 'Binary heap'),
('Data Structures', 'Fundamentals', 'HARD', 'What is the amortized time complexity of append for a dynamic array that doubles capacity?', 1, 'O(1)', 'O(log n)', 'O(n) for every append', 'O(n log n)'),
('Data Structures', 'Fundamentals', 'HARD', 'Which traversal of a binary search tree visits keys in sorted order?', 2, 'Preorder', 'Inorder', 'Postorder', 'Level order'),
('Data Structures', 'Fundamentals', 'HARD', 'What is the primary benefit of path compression in a disjoint-set structure?', 3, 'It sorts each set', 'It guarantees constant time for every operation', 'It flattens find paths to speed up future operations', 'It stores elements in insertion order'),
('Discrete Mathematics', 'Mathematics Basics', 'HARD', 'For finite sets A and B, what is |A union B|?', 4, '|A| + |B| + |A intersection B|', '|A intersection B| - |A| - |B|', '|A| times |B|', '|A| + |B| - |A intersection B|'),
('Discrete Mathematics', 'Mathematics Basics', 'HARD', 'A relation that is reflexive, symmetric, and transitive is an:', 1, 'Equivalence relation', 'Partial function', 'Injective sequence', 'Directed acyclic graph'),
('Discrete Mathematics', 'Mathematics Basics', 'HARD', 'How many edges does a tree with n vertices have?', 2, 'n', 'n - 1', 'n + 1', '2n'),
('Discrete Mathematics', 'Mathematics Basics', 'HARD', 'What is the contrapositive of P implies Q?', 3, 'Q implies P', 'Not P implies not Q', 'Not Q implies not P', 'P if and only if Q'),
('Discrete Mathematics', 'Mathematics Basics', 'HARD', 'How many ways can 3 distinct objects be arranged?', 4, '3', '4', '5', '6'),
('Operating Systems', 'OS Basics', 'HARD', 'What is a page fault?', 1, 'A referenced virtual-memory page is not currently mapped in physical memory', 'A CPU instruction has invalid syntax', 'A process has used all of its file descriptors', 'A disk sector has been formatted'),
('Operating Systems', 'OS Basics', 'HARD', 'Which condition is necessary for deadlock?', 2, 'Preemption of every resource', 'Circular wait', 'An unlimited number of resources', 'Processes that never share resources'),
('Operating Systems', 'OS Basics', 'HARD', 'What is the main purpose of a TLB?', 3, 'Schedule threads by priority', 'Cache disk writes', 'Cache recent virtual-to-physical address translations', 'Detect deadlocks'),
('Operating Systems', 'OS Basics', 'HARD', 'What does a counting semaphore represent?', 4, 'The address space size of one process', 'The number of CPUs installed', 'A process identifier counter', 'A count of available instances of a resource'),
('Operating Systems', 'OS Basics', 'HARD', 'Why can a context switch add overhead?', 1, 'The system saves and restores execution state instead of doing application work', 'It permanently deletes the process', 'It disables virtual memory', 'It recompiles the process source code'),
('Python Programming', 'Python Basics', 'HARD', 'What does a generator function yield?', 2, 'A complete list computed before the call returns', 'Values lazily as iteration requests them', 'Only integer values', 'A new operating-system process'),
('Python Programming', 'Python Basics', 'HARD', 'What is a closure in Python?', 3, 'A class with no methods', 'A generator that cannot be resumed', 'A function retaining access to variables from its enclosing scope', 'A built-in database connection'),
('Python Programming', 'Python Basics', 'HARD', 'Why can using a mutable object as a default argument be surprising?', 4, 'Python copies it for every call', 'It is converted to an immutable tuple', 'It is shared only between threads', 'The same object is reused across calls'),
('Python Programming', 'Python Basics', 'HARD', 'What must generally be true for two objects that compare equal to work correctly as dictionary keys?', 1, 'They must have equal hash values', 'They must have different hash values', 'They must be lists', 'They must have the same identity'),
('Python Programming', 'Python Basics', 'HARD', 'What does a context manager commonly provide through the with statement?', 2, 'Automatic parallel execution', 'Reliable setup and cleanup of a resource', 'Static type inference at runtime', 'Implicit conversion of all exceptions to None'),
('Robotics Engineering', 'Fundamentals', 'HARD', 'What does forward kinematics determine?', 3, 'The motor current needed for a fixed torque', 'The robot path with the fewest waypoints', 'End-effector pose from known joint variables', 'The camera resolution from a lens focal length'),
('Robotics Engineering', 'Fundamentals', 'HARD', 'What is the purpose of a feedback controller?', 4, 'To disable sensors during motion', 'To convert all motion into open-loop commands', 'To guarantee zero measurement noise', 'To reduce the difference between desired and measured behavior'),
('Robotics Engineering', 'Fundamentals', 'HARD', 'What does SLAM enable a mobile robot to do?', 1, 'Build a map while estimating its location within it', 'Increase battery voltage without hardware', 'Classify source code syntax', 'Replace every actuator with a camera'),
('Robotics Engineering', 'Fundamentals', 'HARD', 'Why is sensor fusion useful in robotics?', 2, 'It makes every sensor perfectly accurate', 'It combines complementary measurements to improve state estimates', 'It removes the need for calibration', 'It prevents all communication delay'),
('Robotics Engineering', 'Fundamentals', 'HARD', 'What does a robot Jacobian relate locally?', 3, 'Battery charge to motor temperature', 'Map coordinates to camera pixels only', 'Joint velocities to end-effector velocities', 'Source code lines to execution time'),
('Statistics', 'Statistics Basics', 'HARD', 'In a right-skewed distribution, which relationship is commonly observed?', 4, 'Mean < median < mode', 'Mean = median = mode always', 'Mode < mean < median', 'Mode < median < mean'),
('Statistics', 'Statistics Basics', 'HARD', 'What is a Type I error?', 1, 'Rejecting a true null hypothesis', 'Failing to reject a false null hypothesis', 'Accepting every alternative hypothesis', 'Choosing a confidence interval that is too wide'),
('Statistics', 'Statistics Basics', 'HARD', 'What does a p-value measure under the null hypothesis?', 2, 'The probability that the null hypothesis is true', 'The probability of data at least this extreme, assuming the null hypothesis', 'The size of the population effect', 'The probability the study will replicate exactly'),
('Statistics', 'Statistics Basics', 'HARD', 'If a 95% confidence interval procedure is repeated many times, what does 95% refer to?', 3, 'The probability that this fixed interval contains the parameter after it is observed', 'The percentage of sample values inside the interval', 'The long-run proportion of intervals that contain the true parameter', 'The probability the sample mean equals the parameter'),
('Statistics', 'Statistics Basics', 'HARD', 'What happens to the standard error of the sample mean as sample size increases, assuming the same population variance?', 4, 'It increases linearly', 'It remains exactly unchanged', 'It becomes equal to the population variance', 'It decreases in proportion to one over the square root of sample size');

INSERT INTO questions (topic_id, question_text, difficulty, correct_option)
SELECT t.topic_id, seed.question_text, seed.difficulty, seed.correct_option
FROM adaptive_quiz_seed seed
JOIN subjects s ON s.subject_name = seed.subject_name
JOIN topics t ON t.topic_id = (
    SELECT MIN(t2.topic_id)
    FROM topics t2
    WHERE t2.subject_id = s.subject_id AND t2.topic_name = seed.topic_name
);

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 1, seed.option_one
FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
JOIN adaptive_quiz_seed seed ON seed.subject_name = s.subject_name
    AND seed.topic_name = t.topic_name AND seed.difficulty = q.difficulty
    AND seed.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 2, seed.option_two
FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
JOIN adaptive_quiz_seed seed ON seed.subject_name = s.subject_name
    AND seed.topic_name = t.topic_name AND seed.difficulty = q.difficulty
    AND seed.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 3, seed.option_three
FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
JOIN adaptive_quiz_seed seed ON seed.subject_name = s.subject_name
    AND seed.topic_name = t.topic_name AND seed.difficulty = q.difficulty
    AND seed.question_text = q.question_text;

INSERT INTO question_options (question_id, option_number, option_text)
SELECT q.question_id, 4, seed.option_four
FROM questions q
JOIN topics t ON t.topic_id = q.topic_id
JOIN subjects s ON s.subject_id = t.subject_id
JOIN adaptive_quiz_seed seed ON seed.subject_name = s.subject_name
    AND seed.topic_name = t.topic_name AND seed.difficulty = q.difficulty
    AND seed.question_text = q.question_text;
