CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_num VARCHAR(20) NOT NULL,
    profile_picture VARCHAR(256) NOT 
    bio VARCHAR(100) NOT NULL
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL,
    "description" VARCHAR(350) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    schedule_link VARCHAR(100),
    "type" BOOLEAN NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE courses (
    course_code VARCHAR(50) PRIMARY KEY NOT NULL,
    course_name VARCHAR(255) NOT NULL
);

CREATE TABLE enrollments (
    enrollments_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (course_code) REFERENCES courses(course_code) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE filters (
    filter_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);


CREATE TABLE study_group_enrollments (
    study_group_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

INSERT INTO courses (course_code, course_name) VALUES ('MATH 115', 'Calculus 1');
INSERT INTO courses (course_code, course_name) VALUES ('MATH 116', 'Calculus 2');
INSERT INTO courses (course_code, course_name) VALUES ('MATH 215', 'Multivariable and Vector Calculus');
INSERT INTO courses (course_code, course_name) VALUES ('EECS 183', 'Elementary Programming Concepts');
INSERT INTO courses (course_code, course_name) VALUES ('EECS 203', 'Discrete Math');
INSERT INTO courses (course_code, course_name) VALUES ('EECS 280', 'Programming and Introductory Data Structures');
INSERT INTO courses (course_code, course_name) VALUES ('STATS 250', 'Introduction to Statistics and Data Analysis');
INSERT INTO courses (course_code, course_name) VALUES ('BIOLOGY 171', 'Introductory Biology: Ecology and Evolution');
INSERT INTO courses (course_code, course_name) VALUES ('BIOLOGY 172', 'Introductory Biology: Molecular, Cellular, and Developmental');
INSERT INTO courses (course_code, course_name) VALUES ('BIOLOGY 173', 'Introductory Biology Laboratory');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 130', 'General Chemistry: Macroscopic Investigations and Reaction Principles');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 125', 'General Chemistry Laboratory I');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 210', 'Structure and Reactivity I');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 211', 'Investigations in Chemistry');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 215', 'Structure and Reactivity II');
INSERT INTO courses (course_code, course_name) VALUES ('CHEM 216', 'Synthesis and Characterization of Organic Compounds');
INSERT INTO courses (course_code, course_name) VALUES ('ENGR 101', 'Intro Comp & Prog');
INSERT INTO courses (course_code, course_name) VALUES ('PHYSICS 140', 'General Physics I');
INSERT INTO courses (course_code, course_name) VALUES ('PHYSICS 141', 'Elementary Laboratory I');



