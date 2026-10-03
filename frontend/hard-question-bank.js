/*
 * Deterministic, subject-specific hard practice scenarios.
 * Each subject gets 50 independently parameterized problems, enough for four
 * 10-question hard rounds with spare questions and no reuse in the sequence.
 */
(function () {
    const round = (value, digits = 2) => Number(value.toFixed(digits));
    const question = (subject, topic, i, prompt, answer, unit = "", difficulty = "HARD") => {
        const integerAnswer = ["comparisons", "levels", "subsets", "executions", "entries", "leaves", "pages", "rows", "hosts", "bits", "ticks", "items", "minutes", "packets", "iterations", "bytes", "seconds", "edges", "selections", "slices"].includes(unit);
        const step = integerAnswer
            ? Math.max(Math.ceil(Math.abs(answer) * 0.12), 1)
            : Math.max(Math.abs(answer) * 0.12, 0.1);
        const choices = [answer + step, answer - step, answer + 2 * step];
        const correctIndex = (i * 3 + 1) % 4;
        const values = [];
        for (let index = 0; index < 4; index++) {
            values.push(index === correctIndex ? answer : choices.shift());
        }
        return {
            questionId: `generated-${difficulty.toLowerCase()}-${encodeURIComponent(subject)}-${i + 1}`,
            questionText: prompt,
            difficulty,
            correctOption: correctIndex + 1,
            topic: { topicName: topic },
            options: values.map((value, index) => ({
                optionNumber: index + 1,
                optionText: `${round(value, integerAnswer ? 0 : 2)}${unit ? ` ${unit}` : ""}`
            }))
        };
    };

    const easyPracticeQuestion = (subject, i) => {
        const n = i + 1;
        const make = (topic, prompt, answer, unit = "") =>
            question(subject, topic, i, prompt, answer, unit, "EASY");
        const computingSubjects = [
            "Artificial Intelligence", "C Programming", "Computer Networks", "Data Structures",
            "Database Systems", "Java Programming", "Operating Systems", "Python Programming",
            "Web Development"
        ];
        const mathSubjects = ["Discrete Mathematics", "Engineering Mathematics", "Statistics"];
        const engineeringSubjects = [
            "Aerospace Engineering", "Civil Engineering", "Electrical Engineering",
            "Electronics and Communication", "Mechanical Engineering", "Robotics Engineering"
        ];

        if (computingSubjects.includes(subject)) {
            switch (i) {
                case 0: {
                    const records = 40 + n * 10, removed = 10 + n * 5;
                    return make("Data and Records", `In ${subject}, a system has ${records} records and removes ${removed} of them. How many records remain?`, records - removed, "records");
                }
                case 1: {
                    const elements = 8 + n * 2, bytes = 2 + n;
                    return make("Storage Basics", `An array stores ${elements} values using ${bytes} bytes per value. How much memory does it use?`, elements * bytes, "bytes");
                }
                case 2: {
                    const start = n, end = n + 12, step = 2;
                    return make("Loops", `A program counts from ${start} up to but not including ${end}, increasing by ${step} each time. How many loop iterations run?`, Math.ceil((end - start) / step), "iterations");
                }
                case 3: {
                    const variables = 2 + n % 3;
                    return make("Boolean Logic", `How many rows are needed for a truth table with ${variables} Boolean inputs?`, 2 ** variables, "rows");
                }
                case 4: {
                    const rate = 2 + n, megabytes = rate * (1 + n % 3);
                    return make("Data Transfer", `A ${subject} download transfers ${megabytes} MB at ${rate} MB/s. How many seconds does it take?`, megabytes / rate, "seconds");
                }
                case 5: {
                    const pages = 3 + n, perPage = 20 + n * 5;
                    return make("Data Organization", `A data store for ${subject} holds ${perPage} entries on each of ${pages} pages. How many entries are stored altogether?`, pages * perPage, "entries");
                }
                case 6: {
                    const requests = 100 + n * 20, hits = 50 + n * 10;
                    return make("System Performance", `A service used in ${subject} handles ${requests} requests, of which ${hits} are cache hits. What percentage are cache hits?`, round(100 * hits / requests, 2), "%");
                }
                case 7: {
                    const bytes = 3 + n * 2;
                    return make("Digital Data", `${subject} stores ${bytes} bytes. How many bits is that?`, bytes * 8, "bits");
                }
                case 8: {
                    const total = 30 + n * 15, tasks = 3 + n;
                    return make("Performance Measures", `A ${subject} workflow completes ${tasks} tasks in ${total} ms. What is the average time per task?`, round(total / tasks, 2), "ms per task");
                }
                default: {
                    const rows = 80 + n * 20, selected = 10 + n * 5;
                    return make("Query Results", `A ${subject} query returns ${selected} matching rows from ${rows} rows. How many rows do not match?`, rows - selected, "rows");
                }
            }
        }

        if (mathSubjects.includes(subject)) {
            switch (i) {
                case 0: {
                    const x = 3 + n, add = 4 + n;
                    return make("Algebra", `Solve for x: x + ${add} = ${x + add}.`, x);
                }
                case 1: {
                    const length = 3 + n, width = 2 + n;
                    return make("Area", `A rectangle is ${length} cm long and ${width} cm wide. What is its area?`, length * width, "cm²");
                }
                case 2: {
                    const values = [n, n + 2, n + 4];
                    return make("Averages", `Find the mean of ${values.join(", ")}.`, (values[0] + values[1] + values[2]) / 3);
                }
                case 3: {
                    const total = 40 + n * 10, percent = 10 + n * 5;
                    return make("Percentages", `What is ${percent}% of ${total}?`, total * percent / 100);
                }
                case 4: {
                    const distance = 12 + n * 3, time = 2 + n;
                    return make("Rates", `A runner travels ${distance} km in ${time} hours. What is the average speed?`, round(distance / time, 2), "km/h");
                }
                case 5: {
                    const favorable = 1 + n % 4, outcomes = 6 + n;
                    return make("Probability", `A bag has ${favorable} red counters among ${outcomes} counters. What is the probability of choosing red?`, round(favorable / outcomes, 3));
                }
                case 6: {
                    const original = 2 + n, scale = 2 + n % 3;
                    return make("Ratios", `A recipe uses ${original} cups of flour. How many cups are needed when every ingredient is scaled by ${scale}?`, original * scale, "cups");
                }
                case 7: {
                    const side = 2 + n;
                    return make("Perimeter", `A square has sides of ${side} cm. What is its perimeter?`, side * 4, "cm");
                }
                case 8: {
                    const first = 2 + n, step = 3;
                    return make("Number Patterns", `A sequence starts ${first}, ${first + step}, ${first + 2 * step}, ... What is the next term?`, first + 3 * step);
                }
                default: {
                    const rate = 5 + n, minutes = 2 + n;
                    return make("Unit Rates", `A printer produces ${rate} pages per minute for ${minutes} minutes. How many pages does it print?`, rate * minutes, "pages");
                }
            }
        }

        if (engineeringSubjects.includes(subject)) {
            switch (i) {
                case 0: {
                    const distance = 20 + n * 5, time = 2 + n;
                    return make("Motion", `In ${subject}, a vehicle travels ${distance} m in ${time} seconds. What is its average speed?`, round(distance / time, 2), "m/s");
                }
                case 1: {
                    const mass = 2 + n, acceleration = 2 + n;
                    return make("Forces", `A ${mass} kg component accelerates at ${acceleration} m/s². What force acts on it?`, mass * acceleration, "N");
                }
                case 2: {
                    const length = 2 + n, width = 3 + n;
                    return make("Area", `A rectangular panel used in ${subject} is ${length} m by ${width} m. What is its area?`, length * width, "m²");
                }
                case 3: {
                    const voltage = 6 + n * 2, resistance = 2 + n;
                    return make("Electrical Fundamentals", `A ${resistance} Ω component has ${voltage} V across it. Using Ohm’s law, what current flows?`, round(voltage / resistance, 2), "A");
                }
                case 4: {
                    const force = 10 + n * 5, distance = 2 + n;
                    return make("Work and Energy", `A ${subject} actuator applies ${force} N over ${distance} m. How much work is done?`, force * distance, "J");
                }
                case 5: {
                    const mass = 12 + n * 3, volume = 2 + n;
                    return make("Density", `A material sample has mass ${mass} kg and volume ${volume} m³. What is its density?`, round(mass / volume, 2), "kg/m³");
                }
                case 6: {
                    const length = 2 + n, width = 2 + n, height = 1 + n;
                    return make("Volume", `A block used in ${subject} measures ${length} m × ${width} m × ${height} m. What is its volume?`, length * width * height, "m³");
                }
                case 7: {
                    const input = 50 + n * 10, useful = 20 + n * 5;
                    return make("Efficiency", `A machine receives ${input} J and delivers ${useful} J of useful output. What is its efficiency percentage?`, round(100 * useful / input, 2), "%");
                }
                case 8: {
                    const power = 100 + n * 50, time = 2 + n;
                    return make("Energy", `A device used in ${subject} operates at ${power} W for ${time} seconds. How much energy does it use?`, power * time, "J");
                }
                default: {
                    const meters = 2 + n * 3;
                    return make("Unit Conversion", `Convert a ${subject} measurement of ${meters} m to centimeters.`, meters * 100, "cm");
                }
            }
        }

        if (subject === "Biomedical Engineering" || subject === "Chemical Engineering" || subject === "Environmental Engineering") {
            switch (i) {
                case 0: {
                    const concentration = 5 + n * 2, volume = 2 + n;
                    return make("Concentration", `A sample used in ${subject} has concentration ${concentration} mg/L in ${volume} L. How many milligrams of substance are present?`, concentration * volume, "mg");
                }
                case 1: {
                    const volume = 20 + n * 10, time = 2 + n;
                    return make("Flow Rates", `${volume} L of fluid passes through a system in ${time} minutes. What is the flow rate?`, round(volume / time, 2), "L/min");
                }
                case 2: {
                    const bpm = 60 + n * 5;
                    return make("Measurements", `A monitor records a pulse of ${bpm} beats per minute. About how many milliseconds are between beats?`, round(60000 / bpm, 2), "ms");
                }
                case 3: {
                    const input = 100 + n * 20, output = 50 + n * 10;
                    return make("Yield", `A process in ${subject} starts with ${input} g of material and produces ${output} g of product. What is the percentage yield?`, round(100 * output / input, 2), "%");
                }
                case 4: {
                    const mass = 10 + n * 4, volume = 2 + n;
                    return make("Density", `A sample weighs ${mass} g and occupies ${volume} cm³. What is its density?`, round(mass / volume, 2), "g/cm³");
                }
                case 5: {
                    const celsius = 20 + n * 2;
                    return make("Temperature", `Convert ${celsius}°C to kelvin using K = °C + 273.`, celsius + 273, "K");
                }
                case 6: {
                    const rate = 3 + n, time = 2 + n;
                    return make("Volume", `A pump moves ${rate} L/min for ${time} minutes. How many liters does it move?`, rate * time, "L");
                }
                case 7: {
                    const original = 80 + n * 10, remaining = 20 + n * 5;
                    return make("Dilution", `A treatment reduces a ${original} mg/L concentration to ${remaining} mg/L. How much concentration was removed?`, original - remaining, "mg/L");
                }
                case 8: {
                    const readings = [10 + n, 12 + n, 14 + n];
                    return make("Averages", `Three ${subject} readings are ${readings.join(", ")}. What is their mean?`, (readings[0] + readings[1] + readings[2]) / 3);
                }
                default: {
                    const total = 100 + n * 20, removed = 10 + n * 5;
                    return make("Removal Rates", `A filter removes ${removed} units from ${total} units of a measured pollutant. How many units remain?`, total - removed, "units");
                }
            }
        }

        const first = 4 + n;
        switch (i) {
            case 0: return make(`${subject} Fundamentals`, `A task in ${subject} has ${first} items and adds ${n + 2} more. How many items are there now?`, first + n + 2, "items");
            case 1: return make("Storage Basics", `${first} ${subject} units are stored in each of ${n + 1} groups. How many units are stored?`, first * (n + 1), "units");
            case 2: return make("Rates", `A ${subject} process completes ${first * 2} steps in ${n + 1} minutes. How many steps per minute is that?`, first * 2 / (n + 1), "steps/min");
            case 3: return make("Percentages", `What is ${n * 10}% of ${first * 10}?`, n * first);
            case 4: return make("Comparison", `A ${subject} system has ${first * 3} units and uses ${first} units. How many remain?`, first * 2, "units");
            case 5: return make("Averages", `Find the mean of ${n}, ${n + 2}, and ${n + 4}.`, n + 2);
            case 6: return make("Area", `A ${subject} surface is ${n + 2} m by ${n + 3} m. What is its area?`, (n + 2) * (n + 3), "m²");
            case 7: return make("Unit Conversion", `Convert ${first} groups of 10 ${subject} units into a total number of units.`, first * 10, "units");
            case 8: return make("Time", `A ${subject} operation takes ${n + 2} minutes per cycle and runs for 3 cycles. How long does it take?`, (n + 2) * 3, "minutes");
            default: return make("Counting", `A ${subject} sequence starts at ${n} and increases by 2. What is the fifth term?`, n + 8);
        }
    };

    window.generatePracticeQuestions = function (subject, difficulty) {
        if (difficulty === "EASY") {
            return Array.from({ length: 10 }, (_, i) => easyPracticeQuestion(subject, i));
        }
        const result = [];
        for (let i = 0; i < 10; i++) {
            const n = i + 1;
            const moderate = difficulty === "MODERATE";
            let topic = "Applied Fundamentals";
            let prompt;
            let answer;
            let unit = "";

            switch (subject) {
                case "Aerospace Engineering":
                    topic = "Flight Mechanics";
                    if (!moderate) {
                        const speed = 12 + n * 3, time = 4 + n;
                        prompt = `An aircraft travels at ${speed} m/s for ${time} seconds. How far does it travel?`;
                        answer = speed * time; unit = "m";
                    } else {
                        const thrust = 900 + n * 125, speed = 40 + n * 5;
                        prompt = `An engine produces ${thrust} N of thrust at ${speed} m/s. What propulsive power is produced using P=Tv?`;
                        answer = thrust * speed; unit = "W";
                    }
                    break;
                case "Artificial Intelligence":
                    topic = "Model Evaluation";
                    if (!moderate) {
                        const correct = 62 + n * 17, total = 100 + n * 20;
                        prompt = `A classifier labels ${correct} of ${total} examples correctly. What is its accuracy percentage?`;
                        answer = round(100 * correct / total, 2); unit = "%";
                    } else {
                        const truePositive = 24 + n * 3, falseNegative = 4 + n;
                        prompt = `A model detects ${truePositive} positive cases and misses ${falseNegative}. What is its recall percentage?`;
                        answer = round(100 * truePositive / (truePositive + falseNegative), 2); unit = "%";
                    }
                    break;
                case "Biomedical Engineering":
                    topic = "Physiological Measurements";
                    if (!moderate) {
                        const bpm = 60 + n * 4;
                        prompt = `A heart rate is ${bpm} beats per minute. How many milliseconds elapse between beats?`;
                        answer = round(60000 / bpm, 2); unit = "ms";
                    } else {
                        const volume = 120 + n * 15, hours = 2 + n % 4;
                        prompt = `An infusion delivers ${volume} mL over ${hours} hours. What is its flow rate in mL/hour?`;
                        answer = round(volume / hours, 2); unit = "mL/hour";
                    }
                    break;
                case "C Programming":
                    topic = "Arrays and Integer Representation";
                    if (!moderate) {
                        const length = 8 + n * 3, size = 2 + n % 5;
                        prompt = `A C array has ${length} elements and each element uses ${size} bytes. How many bytes does the array occupy?`;
                        answer = length * size; unit = "bytes";
                    } else {
                        const value = 125 + n * 37, width = 4;
                        prompt = `An unsigned ${width}-byte integer stores ${value}. What is its value after a right shift by ${1 + n % 3} bits?`;
                        answer = Math.floor(value / (2 ** (1 + n % 3))); unit = "";
                    }
                    break;
                case "Chemical Engineering":
                    topic = "Process Calculations";
                    if (!moderate) {
                        const moles = 1 + n * 0.5, volume = 2 + n;
                        prompt = `${round(moles, 1)} mol of solute is dissolved to make ${volume} L of solution. What is the molarity?`;
                        answer = round(moles / volume, 3); unit = "mol/L";
                    } else {
                        const feed = 180 + n * 25, product = 126 + n * 17;
                        prompt = `A process converts ${feed} kg of feed into ${product} kg of desired product. What is the mass yield percentage?`;
                        answer = round(100 * product / feed, 2); unit = "%";
                    }
                    break;
                case "Civil Engineering":
                    topic = "Construction Quantities";
                    if (!moderate) {
                        const length = 4 + n, width = 2 + n % 5;
                        prompt = `A rectangular slab is ${length} m long and ${width} m wide. What is its area?`;
                        answer = length * width; unit = "m²";
                    } else {
                        const length = 3 + n * 0.5, width = 2 + n % 4, depth = 0.15 + n * 0.01;
                        prompt = `A concrete panel measures ${round(length, 1)} m × ${width} m × ${round(depth, 2)} m. What volume of concrete is required?`;
                        answer = round(length * width * depth, 3); unit = "m³";
                    }
                    break;
                case "Computer Networks":
                    topic = "Addressing and Latency";
                    if (!moderate) {
                        const hostBits = n + 2;
                        prompt = `An IPv4 subnet has ${hostBits} host bits. How many usable host addresses are available using 2^h−2?`;
                        answer = 2 ** hostBits - 2; unit = "hosts";
                    } else {
                        const propagation = 8 + n * 2, processing = 3 + n;
                        const queueing = 2 + n % 7;
                        prompt = `A packet experiences ${propagation} ms propagation, ${processing} ms processing, and ${queueing} ms queueing delay. What is the total one-way delay?`;
                        answer = propagation + processing + queueing; unit = "ms";
                    }
                    break;
                case "Data Structures":
                    topic = "Trees and Graphs";
                    if (!moderate) {
                        const internal = 4 + n * 2;
                        prompt = `A full binary tree has ${internal} internal nodes. How many leaves does it have?`;
                        answer = internal + 1; unit = "leaves";
                    } else {
                        const vertices = 18 + n * 4, components = 2 + n % 5;
                        prompt = `A forest has ${vertices} vertices in ${components} connected components. How many edges does it contain?`;
                        answer = vertices - components; unit = "edges";
                    }
                    break;
                case "Database Systems":
                    topic = "Query Planning and Storage";
                    if (!moderate) {
                        const rows = 1200 + n * 850, percent = 5 + n * 3;
                        prompt = `A table has ${rows} rows; a predicate selects ${percent}% of them. Approximately how many rows qualify?`;
                        answer = Math.round(rows * percent / 100); unit = "rows";
                    } else {
                        const rows = 1500 + n * 1000, pageCapacity = 80 + n * 5;
                        prompt = `A table stores ${rows} records with ${pageCapacity} records per disk page. How many pages are needed, rounded up?`;
                        answer = Math.ceil(rows / pageCapacity); unit = "pages";
                    }
                    break;
                case "Discrete Mathematics":
                    topic = "Logic and Counting";
                    if (!moderate) {
                        const variables = n + 2;
                        prompt = `How many rows are in a complete truth table for ${variables} Boolean variables?`;
                        answer = 2 ** variables; unit = "rows";
                    } else {
                        const total = 5 + n, choose = 2 + n % 3;
                        let permutations = 1;
                        for (let k = 0; k < choose; k++) permutations *= total - k;
                        prompt = `How many ordered selections of ${choose} distinct objects can be made from ${total}?`;
                        answer = permutations; unit = "selections";
                    }
                    break;
                case "Electrical Engineering":
                    topic = "Circuit Fundamentals";
                    if (!moderate) {
                        const voltage = 6 + n * 2, resistance = 3 + n;
                        prompt = `A ${resistance} Ω resistor has ${voltage} V across it. Using Ohm’s law, what current flows?`;
                        answer = round(voltage / resistance, 3); unit = "A";
                    } else {
                        const r1 = 4 + n, r2 = 8 + n * 2, voltage = 12 + n * 3;
                        prompt = `Two resistors ${r1} Ω and ${r2} Ω are in series across ${voltage} V. What current flows in the circuit?`;
                        answer = round(voltage / (r1 + r2), 3); unit = "A";
                    }
                    break;
                case "Electronics and Communication":
                    topic = "Signal Electronics";
                    if (!moderate) {
                        const vin = 5 + n, r1 = 2 + n, r2 = 4 + n * 2;
                        prompt = `A loaded voltage divider has Vin=${vin} V, R1=${r1} kΩ and R2=${r2} kΩ. What is Vout across R2?`;
                        answer = round(vin * r2 / (r1 + r2), 3); unit = "V";
                    } else {
                        const resistance = 1000 + n * 500, capacitance = 0.5 + n * 0.2;
                        prompt = `An RC circuit has R=${resistance} Ω and C=${round(capacitance, 1)} μF. Estimate its time constant RC in milliseconds.`;
                        answer = round(resistance * capacitance / 1000, 3); unit = "ms";
                    }
                    break;
                case "Engineering Mathematics":
                    topic = "Calculus and Linear Algebra";
                    if (!moderate) {
                        const coefficient = 2 + n, x = 1 + n * 0.5;
                        prompt = `For f(x)=${coefficient}x², what is f′(${round(x, 1)})?`;
                        answer = round(2 * coefficient * x, 2); unit = "";
                    } else {
                        const a = 2 + n, b = 1 + n % 4, c = 3 + n % 5, d = 4 + n;
                        prompt = `Find the determinant of the 2×2 matrix [[${a}, ${b}], [${c}, ${d}]].`;
                        answer = a * d - b * c; unit = "";
                    }
                    break;
                case "Environmental Engineering":
                    topic = "Water Quality";
                    if (!moderate) {
                        const concentration = 80 + n * 12, volume = 2 + n;
                        prompt = `${volume} L of wastewater has concentration ${concentration} mg/L. What pollutant mass is present?`;
                        answer = concentration * volume; unit = "mg";
                    } else {
                        const bod = 18 + n * 2, flow = 0.4 + n * 0.1;
                        prompt = `Water has BOD ${bod} mg/L and flow ${round(flow, 1)} m³/s. What is the BOD load in kg/s?`;
                        answer = round(bod * flow / 1000, 3); unit = "kg/s";
                    }
                    break;
                case "Java Programming":
                    topic = "Java Control Flow";
                    if (!moderate) {
                        const start = n, stop = n * 4 + 10, step = 2 + n % 4;
                        prompt = `A Java loop increments i by ${step}, starting at ${start} while i < ${stop}. How many iterations run?`;
                        answer = Math.ceil((stop - start) / step); unit = "iterations";
                    } else {
                        const length = 20 + n * 5, index = 3 + n;
                        prompt = `A Java ArrayList has ${length} elements. After removing index ${index}, how many elements remain?`;
                        answer = length - 1; unit = "items";
                    }
                    break;
                case "Mechanical Engineering":
                    topic = "Dynamics";
                    if (!moderate) {
                        const distance = 120 + n * 35, time = 4 + n;
                        prompt = `A mechanism travels ${distance} m in ${time} seconds. What is its average speed?`;
                        answer = round(distance / time, 2); unit = "m/s";
                    } else {
                        const mass = 3 + n * 1.5, velocity = 4 + n;
                        prompt = `A ${round(mass, 1)} kg component moves at ${velocity} m/s. Calculate its kinetic energy using ½mv².`;
                        answer = round(0.5 * mass * velocity ** 2, 2); unit = "J";
                    }
                    break;
                case "Operating Systems":
                    topic = "Processes and Scheduling";
                    if (!moderate) {
                        const busy = 30 + n * 7, elapsed = 60 + n * 10;
                        prompt = `A CPU is busy for ${busy} ms during a ${elapsed} ms observation. What is CPU utilization?`;
                        answer = round(100 * busy / elapsed, 2); unit = "%";
                    } else {
                        const burst = 5 + n * 2, quantum = 2 + n % 4;
                        prompt = `A single process needs ${burst} ms of CPU time and receives a ${quantum} ms round-robin quantum. How many time slices does it need?`;
                        answer = Math.ceil(burst / quantum); unit = "slices";
                    }
                    break;
                case "Python Programming":
                    topic = "Python Sequences";
                    if (!moderate) {
                        const start = n, stop = 40 + n * 3, step = 2 + n % 5;
                        prompt = `What is len(list(range(${start}, ${stop}, ${step}))) in Python?`;
                        answer = Math.ceil((stop - start) / step); unit = "items";
                    } else {
                        const rows = 4 + n, columns = 5 + n * 2;
                        prompt = `A Python list comprehension creates a ${rows} by ${columns} nested grid. How many scalar elements are in the grid?`;
                        answer = rows * columns; unit = "items";
                    }
                    break;
                case "Robotics Engineering":
                    topic = "Robot Motion";
                    if (!moderate) {
                        const radius = 0.1 + n * 0.02, angle = 1 + n * 0.5;
                        prompt = `A robot wheel with radius ${round(radius, 2)} m rotates ${round(angle, 1)} radians without slipping. How far does its rim travel?`;
                        answer = round(radius * angle, 3); unit = "m";
                    } else {
                        const voltage = 5 + n, resistance = 100 + n * 25;
                        prompt = `A robot sensor draws ${round(voltage / resistance * 1000, 2)} mA from ${voltage} V. What is its resistance?`;
                        answer = resistance; unit = "Ω";
                    }
                    break;
                case "Statistics":
                    topic = "Descriptive Statistics";
                    if (!moderate) {
                        const count = 4 + n, mean = 12 + n * 2;
                        prompt = `${count} measurements have mean ${mean}. What is their total sum?`;
                        answer = count * mean; unit = "";
                    } else {
                        const groupA = 8 + n, meanA = 10 + n, groupB = 6 + n, meanB = 14 + n * 2;
                        prompt = `Group A has ${groupA} observations with mean ${meanA}; group B has ${groupB} with mean ${meanB}. Find the combined mean.`;
                        answer = round((groupA * meanA + groupB * meanB) / (groupA + groupB), 3); unit = "";
                    }
                    break;
                case "Web Development":
                    topic = "Web Delivery";
                    if (!moderate) {
                        const requests = 200 + n * 50, cached = 80 + n * 13;
                        prompt = `A site serves ${cached} cached responses from ${requests} requests. What is the cache hit rate?`;
                        answer = round(100 * cached / requests, 2); unit = "%";
                    } else {
                        const images = 3 + n, size = 90 + n * 25;
                        prompt = `A page loads ${images} images of ${size} kB each. What is the combined image payload in MB using 1000 kB per MB?`;
                        answer = round(images * size / 1000, 3); unit = "MB";
                    }
                    break;
                default:
                    topic = `${subject} Fundamentals`;
                    const quantity = 5 + n * 2;
                    prompt = moderate
                        ? `A ${subject} process handles ${quantity} units in each of ${n + 2} cycles. How many units are handled?`
                        : `A ${subject} system handles ${quantity} units per cycle for ${n} cycles. What is the total?`;
                    answer = moderate ? quantity * (n + 2) : quantity * n;
                    unit = "units";
            }

            result.push(question(subject, topic, i, prompt, answer, unit, difficulty));
        }
        return result;
    };

    window.generateHardQuestions = function (subject) {
        const result = [];
        for (let i = 0; i < 50; i++) {
            const n = i + 1;
            let topic;
            let prompt;
            let answer;
            let unit = "";

            switch (subject) {
                case "Aerospace Engineering": {
                    topic = "Flight Mechanics";
                    const rho = 1.0 + (n % 6) * 0.05;
                    const speed = 35 + n * 2;
                    const area = 10 + n % 9;
                    const coefficient = 0.6 + (n % 5) * 0.1;
                    prompt = `A wing has air density ${rho} kg/m³, speed ${speed} m/s, area ${area} m², and lift coefficient ${coefficient}. Using L = ½ρv²SCₗ, estimate lift in newtons.`;
                    answer = round(0.5 * rho * speed ** 2 * area * coefficient, 1);
                    unit = "N";
                    break;
                }
                case "Artificial Intelligence": {
                    topic = "Model Evaluation";
                    const tp = 18 + n * 2;
                    const fp = 3 + n % 11;
                    const fn = 4 + (n * 3) % 13;
                    prompt = `A classifier has TP=${tp}, FP=${fp}, and FN=${fn}. What is its F1 score as a percentage?`;
                    answer = round(200 * tp / (2 * tp + fp + fn), 1);
                    unit = "%";
                    break;
                }
                case "Biomedical Engineering": {
                    topic = "Biomaterials and Dosimetry";
                    const weight = 42 + n * 1.3;
                    const dose = 2 + (n % 8) * 0.25;
                    prompt = `A protocol specifies ${dose} mg/kg for a patient weighing ${round(weight, 1)} kg. What total dose does the calculation produce?`;
                    answer = round(weight * dose, 1);
                    unit = "mg";
                    break;
                }
                case "C Programming": {
                    topic = "Pointers and Memory";
                    const base = 4096 + n * 64;
                    const index = 3 + n % 17;
                    const size = 2 + n % 6;
                    prompt = `An int array begins at byte address ${base}; sizeof(int) is ${size} bytes. What byte address does &a[${index}] have?`;
                    answer = base + index * size;
                    unit = "bytes";
                    break;
                }
                case "Chemical Engineering": {
                    topic = "Heat and Mass Balances";
                    const mass = 4 + n % 23;
                    const cp = 1.8 + (n % 7) * 0.2;
                    const delta = 12 + n * 1.5;
                    prompt = `A ${mass} kg stream with cₚ=${round(cp, 1)} kJ/(kg·K) is heated by ${round(delta, 1)} K. Using Q=mcₚΔT, find the heat added.`;
                    answer = round(mass * cp * delta, 1);
                    unit = "kJ";
                    break;
                }
                case "Civil Engineering": {
                    topic = "Structural Analysis";
                    const load = 4 + n % 19;
                    const span = 3 + (n % 12) * 0.5;
                    prompt = `A simply supported beam carries a uniform load of ${load} kN/m over ${round(span, 1)} m. Using Mmax=wL²/8, calculate the maximum moment.`;
                    answer = round(load * span ** 2 / 8, 2);
                    unit = "kN·m";
                    break;
                }
                case "Computer Networks": {
                    topic = "Network Performance";
                    const bytes = 1200 + n * 137;
                    const rate = 2 + n % 18;
                    prompt = `A ${bytes}-byte packet is sent over a ${rate} Mbit/s link. Ignoring overhead, what is its serialization delay?`;
                    answer = round(bytes * 8 / (rate * 1e6) * 1000, 3);
                    unit = "ms";
                    break;
                }
                case "Data Structures": {
                    topic = "Search Complexity";
                    const items = 120 + n * 137;
                    prompt = `A balanced binary search examines ${items} ordered items. What is the worst-case number of comparisons using ceil(log₂(n+1))?`;
                    answer = Math.ceil(Math.log2(items + 1));
                    unit = "comparisons";
                    break;
                }
                case "Database Systems": {
                    topic = "Indexing and Storage";
                    const rows = 5000 + n * 4321;
                    const fanout = 20 + n % 31;
                    prompt = `A B-tree index stores ${rows} entries with fan-out ${fanout}. Estimate the number of levels as ceil(log_fanout(entries)).`;
                    answer = Math.ceil(Math.log(rows) / Math.log(fanout));
                    unit = "levels";
                    break;
                }
                case "Discrete Mathematics": {
                    topic = "Combinatorics";
                    const total = 12 + n % 15;
                    const choose = 3 + n % 4;
                    let combinations = 1;
                    for (let k = 1; k <= choose; k++) combinations = combinations * (total - k + 1) / k;
                    prompt = `How many ${choose}-element subsets can be selected from ${total} distinct elements? Calculate C(${total},${choose}).`;
                    answer = Math.round(combinations);
                    unit = "subsets";
                    break;
                }
                case "Electrical Engineering": {
                    topic = "Circuit Analysis";
                    const current = 0.4 + (n % 20) * 0.15;
                    const resistance = 18 + n * 2;
                    prompt = `A resistive load of ${resistance} Ω carries ${round(current, 2)} A. Using P=I²R, calculate the dissipated power.`;
                    answer = round(current ** 2 * resistance, 2);
                    unit = "W";
                    break;
                }
                case "Electronics and Communication": {
                    topic = "Analog Electronics";
                    const feedback = 12 + n * 3;
                    const input = 2 + n % 9;
                    prompt = `An ideal inverting amplifier has Rf=${feedback} kΩ and Rin=${input} kΩ. What is the magnitude of its voltage gain?`;
                    answer = round(feedback / input, 2);
                    unit = "V/V";
                    break;
                }
                case "Engineering Mathematics": {
                    topic = "Numerical Methods";
                    const a = 2 + n % 13;
                    const x = 1 + n * 0.7;
                    const b = 5 + n % 17;
                    const y = a * x + b;
                    prompt = `For f(x)=${a}x+${b}, solve f(x)=${round(y, 1)}. What is x?`;
                    answer = round((y - b) / a, 2);
                    unit = "";
                    break;
                }
                case "Environmental Engineering": {
                    topic = "Pollutant Fate";
                    const initial = 80 + n * 5;
                    const rate = 0.03 + (n % 8) * 0.01;
                    const time = 2 + n % 11;
                    prompt = `A pollutant decays by C=C₀e^(-kt), with C₀=${initial} mg/L, k=${round(rate, 2)}/day, and t=${time} days. Estimate C.`;
                    answer = round(initial * Math.exp(-rate * time), 2);
                    unit = "mg/L";
                    break;
                }
                case "Java Programming": {
                    topic = "Algorithm Analysis";
                    const size = 30 + n * 7;
                    prompt = `A Java loop runs i=0..${size - 1}; for each i, an inner loop runs j=i+1..${size - 1}. How many inner-body executions occur?`;
                    answer = size * (size - 1) / 2;
                    unit = "executions";
                    break;
                }
                case "Mechanical Engineering": {
                    topic = "Mechanics of Materials";
                    const force = 8 + n * 1.7;
                    const area = 120 + n * 9;
                    prompt = `A member carries ${round(force, 1)} kN axial force over ${area} mm² cross-sectional area. Calculate normal stress in MPa.`;
                    answer = round(force * 1000 / area, 2);
                    unit = "MPa";
                    break;
                }
                case "Operating Systems": {
                    topic = "Memory Management";
                    const hit = 0.7 + (n % 6) * 0.04;
                    const cache = 8 + n % 13;
                    const memory = 70 + n * 3;
                    prompt = `A TLB hit ratio is ${round(hit, 2)}, lookup time ${cache} ns, and memory access ${memory} ns. With one memory access on a hit and two on a miss, find EAT.`;
                    answer = round(hit * (cache + memory) + (1 - hit) * (cache + 2 * memory), 2);
                    unit = "ns";
                    break;
                }
                case "Python Programming": {
                    topic = "Algorithm Analysis";
                    const size = 12 + n * 3;
                    prompt = `How many times does the body execute in Python code equivalent to: for i in range(${size}): for j in range(i): work()?`;
                    answer = size * (size - 1) / 2;
                    unit = "executions";
                    break;
                }
                case "Robotics Engineering": {
                    topic = "Motion and Sensing";
                    const ticks = 900 + n * 137;
                    const counts = 360 + n % 8 * 90;
                    const radius = 0.04 + (n % 7) * 0.01;
                    prompt = `A robot wheel of radius ${round(radius, 2)} m records ${ticks} encoder counts; its resolution is ${counts} counts per wheel revolution. How far did the robot travel?`;
                    answer = round(ticks / counts * 2 * Math.PI * radius, 3);
                    unit = "m";
                    break;
                }
                case "Statistics": {
                    topic = "Inference and Standardization";
                    const value = 40 + n * 2.3;
                    const mean = 30 + n * 1.4;
                    const sd = 3 + n % 9;
                    prompt = `A measurement x=${round(value, 1)} comes from a distribution with mean ${round(mean, 1)} and standard deviation ${sd}. Calculate its z-score.`;
                    answer = round((value - mean) / sd, 3);
                    unit = "";
                    break;
                }
                case "Web Development": {
                    topic = "Web Performance";
                    const payload = 180 + n * 73;
                    const bandwidth = 3 + n % 17;
                    prompt = `A web response payload is ${payload} kB and effective throughput is ${bandwidth} Mbit/s. Ignoring latency and protocol overhead, estimate transfer time.`;
                    answer = round(payload * 8 / (bandwidth * 1000), 3);
                    unit = "s";
                    break;
                }
                default:
                    topic = `${subject} Applications`;
                    const quantity = 25 + n * 17;
                    const efficiency = 0.55 + (n % 8) * 0.05;
                    prompt = `A ${subject} system processes ${quantity} units at ${round(efficiency, 2)} efficiency. How many useful units result?`;
                    answer = round(quantity * efficiency, 2);
                    unit = "units";
            }
            result.push(question(subject, topic, i, prompt, answer, unit));
        }
        return result;
    };
})();
