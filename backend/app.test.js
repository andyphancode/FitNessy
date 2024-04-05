"use strict";

const request = require("supertest");
const db = require("./db.js");
const app = require("./app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /token */

describe("POST /token", function () {
  test("works", async function () {
    const resp = await request(app)
        .post("/token")
        .send({
          username: "testuser1",
          password: "password1",
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
        .post("/token")
        .send({
          username: "no-such-user",
          password: "password",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
        .post("/token")
        .send({
          username: "testuser1",
          password: "nope",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/token")
        .send({
          username: "testuser1",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/token")
        .send({
          username: 42,
          password: "above-is-a-number",
        });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /register */

describe("POST /register", function () {
  test("works for anon", async function () {
    const resp = await request(app)
        .post("/register")
        .send({
          username: "newuser",
          password: "password",
          email: "new@email.com",
        });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("duplicate user fail", async function () {
    const resp = await request(app)
        .post("/register")
        .send({
          username: "testuser1",
          password: "password1",
          email: "test1@test.com",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/register")
        .send({
          username: "newuser",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/register")
        .send({
          username: "newuser",
          password: "password",
          email: "not-an-email",
        });
    expect(resp.statusCode).toEqual(400);
  });
})

/************************************** DELETE /:username */
describe("DELETE /:username", function () {

  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/testuser1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "testuser1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/testuser1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/testuser1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/user-doesnt-exist`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /exercises */
describe("GET /exercises", function () {

  test("works", async function () {
    const resp = await request(app)
        .get(`/exercises`);
        expect(resp.body).toEqual([
          {
              exercise_id: 1,
              exercise_link: "http://exercise1.com",
              exercise_name: "exercise1",
              instructions: "instructions1",
              equipment: "exerciseEq1",
              bodypart: "exerciseBodyPart1",
              image_src: "http://e1.img",
          },
          {
              exercise_id: 2,
              exercise_link: "http://exercise2.com",
              exercise_name: "exercise2",
              instructions: "instructions2",
              equipment: "exerciseEq2",
              bodypart: "exerciseBodyPart2",
              image_src: "http://e2.img",
          },
          {
              exercise_id: 3,
              exercise_link: "http://exercise3.com",
              exercise_name: "exercise3",
              instructions: "instructions3",
              equipment: "exerciseEq3",
              bodypart: "exerciseBodyPart3",
              image_src: "http://e3.img",
          },
      ]);
  });

});

/************************************** GET /:username/workouts/:date */
describe("GET /:username/workouts/:date", function () {
  
  test("works", async function () {
    const resp = await request(app)
            .get("/testuser1/workouts/2000-01-01")
            .set("authorization",`Bearer ${u1Token}`);
            expect(resp.body[0]).toEqual(
              {
                user_exercise_id: 1,
                exercise_date: expect.any(String),
                exercise_timestamp: expect.any(String),
                rep1: 1,
                rep2: 1,
                rep3: 1,
                rep4: 0,
                rep5: 0,
                rir1: 1,
                rir2: 1,
                rir3: 1,
                rir4: 0,
                rir5: 0,
                username: "testuser1",
                exercise_id: 1
              }
            );
  })

  test("unauthorized error if anon", async function () {
    const resp = await request(app)
            .get("/testuser1/workouts/2000-01-01")
            expect(resp.statusCode).toEqual(401);
  })
});

/************************************** POST /:username/workouts/ */

describe("POST :/username/workouts", function () {
  
  test("works", async function () {
    const resp = await request(app)
          .post("/testuser1/workouts")
          .send({
            exerciseId: 2,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
          })
          .set("authorization", `Bearer ${u1Token}`);
          expect(resp.body).toEqual({
            added:{
              user_exercise_id: expect.any(Number),
              exercise_date: expect.any(String),
              exercise_timestamp: expect.any(String),
              rep1: 5,
              rep2: 4,
              rep3: 5,
              rep4: 4,
              rep5: 5,
              rir1: 5,
              rir2: 4,
              rir3: 5,
              rir4: 4,
              rir5: 5,
              username: "testuser1",
              exercise_id: 2
            }
          })
  });

  test("bad request on duplicate data", async function () {
    const resp = await request(app)
          .post("/testuser1/workouts")
          .send({
            exerciseId: 2,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
          })
          .set("authorization", `Bearer ${u1Token}`);
    const resp2 = await request(app)
          .post("/testuser1/workouts")
          .send({
            exerciseId: 2,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
          })
          .set("authorization", `Bearer ${u1Token}`);
          expect(resp2.statusCode).toEqual(400);
  });

  test("unauthorized error on unauth user", async function () {
    const resp = await request(app)
          .post("/testuser1/workouts")
          .send({
            exerciseId: 2,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
          })
          .set("authorization", `Bearer ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
  });

  test("not found error on invalid exercise id", async function () {
    const resp = await request(app)
          .post("/testuser1/workouts")
          .send({
            exerciseId: 9000,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
          })
          .set("authorization", `Bearer ${u1Token}`);
          expect(resp.statusCode).toEqual(404);
  });
})

/************************************** PATCH /:username/workouts/:user_exercise_id */

describe("PATCH /:username/workouts/:user_exercise_id", function () {

  test("works", async function () {
    const resp = await request(app)
        .patch(`/testuser1/workouts/1`)
        .send({
          exerciseId: 2,
          reps: [1, 2, 3, 4, 5],
          rir: [1, 2, 3, 4, 5],          
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
          updated:{
            user_exercise_id: 1,
            exercise_date: expect.any(String),
            exercise_timestamp: expect.any(String),
            rep1: 1,
            rep2: 2,
            rep3: 3,
            rep4: 4,
            rep5: 5,
            rir1: 1,
            rir2: 2,
            rir3: 3,
            rir4: 4,
            rir5: 5,
            username: "testuser1",
            exercise_id: 2
          }
        })
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/testuser1/workouts/1`)
        .send({})
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400)
  });

  test("unauth for non-matching user", async function () {
    const resp = await request(app)
        .patch(`/testuser1/workouts/1`)
        .send({
          exerciseId: 2,
          reps: [1, 2, 3, 4, 5],
          rir: [1, 2, 3, 4, 5],
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/testuser1/workouts/1`)
        .send({
          exerciseId: 2,
          reps: [1, 2, 3, 4, 5],
          rir: [1, 2, 3, 4, 5],
        });
    expect(resp.statusCode).toEqual(401);
  });



});

/************************************** DELETE /:username/workouts/:user_exercise_id */
describe("DELETE :/username/workouts/:user_exercise_id", function () {
  
  test("works for same user", async function () {
    const resp = await request(app)
            .delete("/testuser1/workouts/1")
            .set("authorization",`Bearer ${u1Token}`);
            expect(resp.body).toEqual(
              {deleted: {
                user_exercise_id: 1,
                exercise_date: expect.any(String),
                exercise_timestamp: expect.any(String),
                rep1: 1,
                rep2: 1,
                rep3: 1,
                rep4: 0,
                rep5: 0,
                rir1: 1,
                rir2: 1,
                rir3: 1,
                rir4: 0,
                rir5: 0,
                username: "testuser1",
                exercise_id: 1
              }}
            );
  })

  test("unauthorized error if anon", async function () {
    const resp = await request(app)
            .delete("/testuser1/workouts/1")
            expect(resp.statusCode).toEqual(401);
  });

  test("unauthorized error if invalid token/username", async function () {
    const resp = await request(app)
            .delete("/fake-user-not-real/workouts/1")
            .set("authorization",`Bearer ${u1Token}`);
            expect(resp.statusCode).toEqual(401);
  });

  test("not found error if invalid user_exercise_id", async function () {
    const resp = await request(app)
            .delete("/testuser1/workouts/9000")
            .set("authorization",`Bearer ${u1Token}`);
            expect(resp.statusCode).toEqual(404);
  });

});