"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Workout {

    /** Retrieves exercises done on specific date for given user. */
    static async getExercisesByDate(username, date) {
        const results = await db.query(
            `SELECT *
             FROM user_exercises
             WHERE username = $1 AND exercise_date = $2`,
             [username, date],
        );

        return results.rows
    }

    

}

module.exports = Workout;