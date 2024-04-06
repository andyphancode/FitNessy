"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  commonBeforeAll,
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser1", "password1");
    expect(user).toEqual({
      username: "testuser1",
      email: "test1@test.com"
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("no-such-user", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("testuser", "wrongpassword");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/** remove */

describe("remove", function () {
    test("works", async function () {
      await User.remove("testuser1");
      const res = await db.query(
          "SELECT * FROM fitnessy_users WHERE username='testuser1'");
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such user", async function () {
      try {
        await User.remove("no-such-user");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    email: "test@test.com"
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM fitnessy_users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });


  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */
describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser1");
    expect(user).toEqual({
      username: "testuser1",
      email: "test1@test.com",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("no-such-user");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});