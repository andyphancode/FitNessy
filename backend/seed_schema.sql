CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE exercises (
    exercise_id SERIAL PRIMARY KEY ,
    exercise_link VARCHAR(255) NOT NULL,
    instructions VARCHAR(5000),
    exercise_name VARCHAR(255) NOT NULL,
    equipment VARCHAR(255),
    bodypart VARCHAR(255),
    image_src VARCHAR(255)
);

CREATE TABLE templates (
    template_id SERIAL PRIMARY KEY,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises ON DELETE CASCADE
);

CREATE TABLE user_exercises (
    user_exercise_id SERIAL PRIMARY KEY,
    exercise_date DATE,
    exercise_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rep1 INT DEFAULT 0,
    rep2 INT DEFAULT 0,
    rep3 INT DEFAULT 0,
    rep4 INT DEFAULT 0,
    rep5 INT DEFAULT 0,
    rir1 INT DEFAULT 0,
    rir2 INT DEFAULT 0,
    rir3 INT DEFAULT 0,
    rir4 INT DEFAULT 0,
    rir5 INT DEFAULT 0,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises ON DELETE CASCADE
);
