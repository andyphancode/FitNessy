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