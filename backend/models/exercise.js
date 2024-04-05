"use strict";

const db = require("../db");

class Exercise {
    /** Find all exercises.
     * 
     * Returns [{exercise_link, instructions, exercise_name, equipment, bodypart, image_src}, ...]
     * 
     */

    static async findAll() {
        let results = await db.query(`SELECT * FROM exercises`);
        return results.rows;
    }
}

module.exports = Exercise;