"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Exercise {
    
    /** Find all exercises.
     * 
     * Returns [{exercise_id, exercise_link, instructions, exercise_name, equipment, bodypart, image_src}, ...]
     * 
     */

    static async getExercises() {
        let results = await db.query(`SELECT * FROM exercises`);
        return results.rows;
    }

    /** Find one exercise
     * 
     * Returns {exercise_id, exercise_link, instructions, exercise_name, equipment, bodypart, image_src}
     * 
     */

    static async get(id) {
        const exerciseRes = await db.query(
            `SELECT exercise_id,
                    exercise_link,
                    instructions,
                    exercise_name,
                    equipment,
                    bodypart,
                    image_src
             FROM exercises
             WHERE exercise_id = $1`, [id]
        )
        
        const exercise = exerciseRes.rows[0];

        if(!exercise) throw new NotFoundError(`No exercise: ${id}`);

        return exercise;
    }
}

module.exports = Exercise;