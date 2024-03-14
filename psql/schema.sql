CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_num VARCHAR(20) NOT NULL,
    profile_picture VARCHAR(256) NOT NULL
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

UPDATE courses SET course_name = 'Calculus 1' WHERE course_code = 'MATH 115';
UPDATE courses SET course_name = 'Calculus 2' WHERE course_code = 'MATH 116';
UPDATE courses SET course_name = 'Multivariable and Vector Calculus' WHERE course_code = 'MATH 215';
UPDATE courses SET course_name = 'Elementary Programming Concepts' WHERE course_code = 'EECS 183';
UPDATE courses SET course_name = 'Discrete Math' WHERE course_code = 'EECS 203';
UPDATE courses SET course_name = 'Programming and Introductory Data Structures' WHERE course_code = 'EECS 280';
UPDATE courses SET course_name = 'Introduction to Statistics and Data Analysis' WHERE course_code = 'STATS 250';
UPDATE courses SET course_name = 'Introductory Biology: Ecology and Evolution' WHERE course_code = 'BIOLOGY 171';
UPDATE courses SET course_name = 'Introductory Biology: Molecular, Cellular, and Developmental' WHERE course_code = 'BIOLOGY 172';
UPDATE courses SET course_name = 'Introductory Biology Laboratory' WHERE course_code = 'BIOLOGY 173';
UPDATE courses SET course_name = 'General Chemistry: Macroscopic Investigations and Reaction Principles' WHERE course_code = 'CHEM 130';
UPDATE courses SET course_name = 'General Chemistry Laboratory I' WHERE course_code = 'CHEM 125';
UPDATE courses SET course_name = 'Structure and Reactivity I' WHERE course_code = 'CHEM 210';
UPDATE courses SET course_name = 'Investigations in Chemistry' WHERE course_code = 'CHEM 211';
UPDATE courses SET course_name = 'Structure and Reactivity II' WHERE course_code = 'CHEM 215';
UPDATE courses SET course_name = 'Synthesis and Characterization of Organic Compounds' WHERE course_code = 'CHEM 216';
UPDATE courses SET course_name = 'Intro Comp & Prog' WHERE course_code = 'ENGR 101';
UPDATE courses SET course_name = 'General Physics I' WHERE course_code = 'PHYSICS 140';
UPDATE courses SET course_name = 'Elementary Laboratory I' WHERE course_code = 'PHYSICS 141';


