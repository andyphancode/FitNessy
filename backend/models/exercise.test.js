"use strict";

const Exercise = require("./exercise.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("../_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** getExercises */
describe("getExercises", function () {
    test("works: all", async function () {
        let exercises = await Exercise.getExercises();
        expect(exercises).toEqual([
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