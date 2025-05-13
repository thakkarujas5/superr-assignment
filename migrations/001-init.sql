CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roles JSON NOT NULL
);
CREATE TABLE Sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    class_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    duration INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Session_Heartbeats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NULL,
    type VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Quiz (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    duration INT NULL
);

CREATE TABLE Question (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    text TEXT NOT NULL
);

CREATE TABLE Answers (
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    student_id INT NOT NULL,
    result BOOLEAN NOT NULL,
    start_time DATETIME NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (quiz_id, question_id, student_id)
);

CREATE TABLE ReportCache (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    report_type ENUM('student performance', 'classroom engagement', 'content effectiveness') NOT NULL,
    report JSON NOT NULL
);

