"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Workout {

    /** Retrieves exercises done on specific date for given user. */
    static async getExercisesByDate(username, date) {
        const query = `
            SELECT ue.*, e.exercise_link, e.instructions, e.exercise_name, e.equipment, e.bodypart, e.image_src
            FROM user_exercises ue
            JOIN exercises e ON ue.exercise_id = e.exercise_id
            WHERE ue.username = $1 AND ue.exercise_date = $2
        `;
    
        const results = await db.query(query, [username, date]);
    
        return results.rows;
    }
    

    /** Deletes an exercise from a given workout */
    static async deleteExercise(username, userExerciseId) {
        // Check if the exercise exists
        const existingExercise = await db.query(
            `SELECT 1
             FROM user_exercises
             WHERE username = $1 AND user_exercise_id = $2`,
             [username, userExerciseId],
        );

        if (existingExercise.rows.length === 0) {
            throw new NotFoundError("Exercise not found");
        }

        // Delete the exercise
        const result = await db.query(
            `DELETE FROM user_exercises
             WHERE username = $1 AND user_exercise_id = $2
             RETURNING *`,
             [username, userExerciseId],
        );

        if (result.rowCount === 0) {
            throw new NotFoundError("Exercise not found");
        }

        return result.rows[0];
    }

    /** Updates an exercise in the workout. */
    static async updateExercise(username, userExerciseId, updates) {

        // Bad request error handler
        const keys = Object.keys(updates);
        if (keys.length === 0) throw new BadRequestError("No data");

        // Destructure updates object to extract specific fields
        const { exerciseId, reps, rir } = updates;

        // Check if the exercise exists
        const exerciseResult = await db.query(
            `SELECT * 
             FROM user_exercises
             WHERE username = $1 AND user_exercise_id = $2`,
             [username, userExerciseId]
        );

        if (exerciseResult.rows.length === 0) {
            throw new NotFoundError('Exercise not found');
        }

        // Update the exercise with the provided data
        const result = await db.query(
            `UPDATE user_exercises
             SET exercise_id = $1, rep1 = $2, rep2 = $3, rep3 = $4, rep4 = $5, rep5 = $6,
                 rir1 = $7, rir2 = $8, rir3 = $9, rir4 = $10, rir5 = $11
             WHERE username = $12 AND user_exercise_id = $13
             RETURNING *`,
            [exerciseId, ...reps, ...rir, username, userExerciseId]
        );

        // After updating, fetch the updated exercise details combined with exercise info
        const combinedDetailsResult = await db.query(
            `SELECT ue.*, e.exercise_link, e.instructions, e.exercise_name, e.equipment, e.bodypart, e.image_src
            FROM user_exercises ue
            JOIN exercises e ON ue.exercise_id = e.exercise_id
            WHERE ue.username = $1 AND ue.user_exercise_id = $2`,
            [username, userExerciseId]
        );

        if (combinedDetailsResult.rows.length === 0) {
            throw new NotFoundError('Updated exercise not found');
        }

        return combinedDetailsResult.rows[0];

    }

    /** Adds an exercise to the workout for a specific date.
     * 
     * @param {string} username - The username of the user performing the exercise.
     * @param {Date} date - The date of the workout.
     * @param {number} exerciseId - The ID of the exercise to add.
     * @param {object} reps - Array containing reps for each set.
     * @param {object} rir - Array containing RIR for each set.
     */
    static async addExercise(username, user_exercise_data) {

            const { exercise_id, exercise_date, reps, rir } = user_exercise_data;

            // Check if the exercise ID exists
            const exerciseExists = await db.query(
                `SELECT EXISTS (
                    SELECT 1
                    FROM exercises
                    WHERE exercise_id = $1
                ) AS "exists"`,
                [exercise_id]
            );

            if (!exerciseExists.rows[0].exists) {
                throw new NotFoundError(`Exercise with ID ${exercise_id} not found`);
            }

            // Check for duplicates
            const duplicateCheck = await db.query(
                `SELECT user_exercise_id
                 FROM user_exercises
                 WHERE username = $1 AND exercise_date = $2 AND exercise_id = $3`,
                 [username, exercise_date, exercise_id]
            );

            if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate exercise.`);

            // Insert the exercise into the database
            const result = await db.query(`
                INSERT INTO user_exercises (username, exercise_id, exercise_date, rep1, rep2, rep3, rep4, rep5, rir1, rir2, rir3, rir4, rir5)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *
            `, [username, exercise_id, exercise_date, ...reps, ...rir]);

            // Fetch the added exercise details combined with exercise info
            const combinedDetailsResult = await db.query(`
                SELECT ue.*, e.exercise_link, e.instructions, e.exercise_name, e.equipment, e.bodypart, e.image_src
                FROM user_exercises ue
                JOIN exercises e ON ue.exercise_id = e.exercise_id
                WHERE ue.username = $1 AND ue.exercise_date = $2 AND ue.exercise_id = $3
            `, [username, exercise_date, exercise_id]);

            if (combinedDetailsResult.rows.length === 0) {
                throw new NotFoundError('Added exercise not found');
            }

            return combinedDetailsResult.rows[0];
        
    }

}

module.exports = Workout;