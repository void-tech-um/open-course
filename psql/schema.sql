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
    course_code VARCHAR(50) PRIMARY KEY NOT NULL
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