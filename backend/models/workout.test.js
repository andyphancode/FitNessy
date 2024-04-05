"use strict";

const Workout = require("./workout.js");
const db = require("../db.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("../_testCommon");
const { BadRequestError, NotFoundError } = require("../expressError.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** getExercisesByDate */

describe("getExercisesByDate", function () {
    test("works", async function () {
        let exercises = await Workout.getExercisesByDate("testuser1","2000-01-01");
        expect(exercises).toEqual([
            {
                user_exercise_id: 1,
                exercise_date: expect.any(Date),
                exercise_timestamp: expect.any(Date),
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
        ])
    })
})

/** deleteExercise */
describe("deleteExercise", function () {
    test("works", async function () {
        await Workout.deleteExercise("testuser1", 1);
        const res = await db.query("SELECT user_exercise_id FROM user_exercises WHERE username = 'testuser1'");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such exercise", async function () {
        try {
            await Workout.deleteExercise("testuser1", 2);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
});

/** updateExercise */
describe("updateExercise", function () {
    test("works", async function () {
        await Workout.updateExercise("testuser1", 1, 
        {
            exerciseId: 2,
            reps: [1, 2, 3, 4, 5],
            rir: [1, 2, 3, 4, 5],
        });
        const res = await db.query("SELECT * FROM user_exercises WHERE user_exercise_id = 1");
        expect(res.rows[0]).toEqual(
            {
                user_exercise_id: 1,
                exercise_date: expect.any(Date),
                exercise_timestamp: expect.any(Date),
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
        )
    });

    test("works: null fields", async function () {
        await Workout.updateExercise("testuser1", 1, 
        {
            exerciseId: 2,
            reps: [1, 2, 3, null, null],
            rir: [1, 2, 3, null, null],
        });
        const res = await db.query("SELECT * FROM user_exercises WHERE user_exercise_id = 1");
        expect(res.rows[0]).toEqual(
            {
                user_exercise_id: 1,
                exercise_date: expect.any(Date),
                exercise_timestamp: expect.any(Date),
                rep1: 1,
                rep2: 2,
                rep3: 3,
                rep4: null,
                rep5: null,
                rir1: 1,
                rir2: 2,
                rir3: 3,
                rir4: null,
                rir5: null,
                username: "testuser1",
                exercise_id: 2
            }
        )
    });

    test("not found if no such exercise", async function() {
        try {
            await Workout.updateExercise("testuser1", 3, 
            {
                exerciseId: 2,
                reps: [1, 2, 3, 4, 5],
                rir: [1, 2, 3, 4, 5],
            });
            fail();    
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function() {
        try {
            await Workout.updateExercise("testuser1", 3, {});
            fail();    
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
});

/** addExercise */
describe("addExercise", function () {
    test("works", async function () {
        const res = await Workout.addExercise("testuser1",
        {
            exerciseId: 2,
            date: "2000-01-01",
            reps: [5,4,5,4,5],
            rir: [5,4,5,4,5]
        });
        expect(res).toEqual({
            user_exercise_id: expect.any(Number),
            exercise_date: expect.any(Date),
            exercise_timestamp: expect.any(Date),
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
        });
    });

    test("bad request with dupes", async function () {
        try {
            await Workout.addExercise("testuser1",
            {
                exerciseId: 2,
                date: "2000-01-01",
                reps: [5,4,5,4,5],
                rir: [5,4,5,4,5]
            });
            await Workout.addExercise("testuser1",
            {
                exerciseId: 2,
                date: "2000-01-01",
                reps: [5,4,5,4,5],
                rir: [5,4,5,4,5]
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("not found request with invalid exercise id", async function () {
        try {
            await Workout.addExercise("testuser1",
            {
                exerciseId: 9000,
                date: "2000-01-01",
                reps: [5,4,5,4,5],
                rir: [5,4,5,4,5]
            });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})