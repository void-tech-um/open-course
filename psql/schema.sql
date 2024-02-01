CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_num VARCHAR(20) NOT NULL,
    profile_picture VARCHAR(256) NOT NULL
);

CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    owner VARCHAR(50),
    message VARCHAR(350),
    class VARCHAR(50),
    created DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL, 
    username VARCHAR(50) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

SELECT * FROM users JOIN courses ON users.username = courses.username;