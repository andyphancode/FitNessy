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
    username VARCHAR(25),
    exercise_id INT,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);

CREATE TABLE user_exercises (
    user_exercise_id SERIAL PRIMARY KEY,
    username VARCHAR(25),
    exercise_id INT,
    exercise_date DATE,
    rep1 INT,
    rep2 INT,
    rep3 INT,
    rep4 INT,
    rep5 INT,
    rir1 INT,
    rir2 INT,
    rir3 INT,
    rir4 INT,
    rir5 INT,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);