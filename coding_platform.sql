CREATE TABLE questions (
    que_id SERIAL PRIMARY KEY,
    que_title VARCHAR(200) NOT NULL,
    que_desc VARCHAR(1000) NOT NULL,
    que_tags VARCHAR(30) NOT NULL,
    que_level VARCHAR(10) NOT NULL
);

CREATE TABLE test_cases (
    tc_id SERIAL PRIMARY KEY,
    tc_input VARCHAR(200) NOT NULL,
    tc_output VARCHAR(200) NOT NULL,
    que_id INT,
    FOREIGN KEY (que_id) REFERENCES questions (que_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    user_email VARCHAR(30) NOT NULL,
    user_password VARCHAR(30) NOT NULL
);

CREATE TABLE user_ans (
    que_id INT NOT NULL,
    user_id INT NOT NULL,
    code TEXT,
    code_date DATE NOT NULL,
    code_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    passed_test_cases INT NOT NULL,
    PRIMARY KEY (que_id, user_id),
    FOREIGN KEY (que_id) REFERENCES questions (que_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE user_record (
    user_id INT PRIMARY KEY,
    que_id INT,
    easy INT NOT NULL,
    medium INT NOT NULL,
    hard INT NOT NULL,
    active_days INT NOT NULL,
    streak INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

