const bcrypt = require("bcrypt");
const User = require("./models/user");
const db = require("./db.js");
const { createToken } = require("./helpers/tokens")
const { BCRYPT_WORK_FACTOR } = require("./config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM user_exercises");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM fitnessy_users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM fitnessy_exercises");

  await db.query(`
        INSERT INTO fitnessy_exercises(exercise_id, exercise_link, instructions, exercise_name, equipment, bodypart, image_src)
        VALUES ($1, 'http://exercise1.com', 'instructions1', 'exercise1', 'exerciseEq1', 'exerciseBodyPart1', 'http://e1.img'),
            ($2, 'http://exercise2.com', 'instructions2', 'exercise2', 'exerciseEq2', 'exerciseBodyPart2', 'http://e2.img'),
            ($3, 'http://exercise3.com', 'instructions3', 'exercise3', 'exerciseEq3', 'exerciseBodyPart3', 'http://e3.img')
  `,[1,2,3]);

  await User.register({
    username: "testuser1",
    password: "password1",
    email: "test1@test.com"
  })

  await User.register({
    username: "testuser2",
    password: "password2",
    email: "test2@test.com"
  })

  await db.query(`
        INSERT INTO user_exercises(user_exercise_id,
                                   username, 
                                   exercise_id, 
                                   exercise_date, 
                                   rep1, 
                                   rep2, 
                                   rep3, 
                                   rir1, 
                                   rir2, 
                                   rir3)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
               ($11,$12,$13,$14,$15,$16,$17,$18, $19, $20)`,
        [1,'testuser1',1,'2000-01-01',1,1,1,1,1,1,2,'testuser2',2,'2000-02-02',2,2,2,2,2,2],);

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "testuser1"});
const u2Token = createToken({ username: "testuser2"});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
};