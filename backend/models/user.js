"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

    /** Authenticates user with username and password input. Returns User json
     * 
     * Throws UnauthorizedError if not found or wrong password.
     * 
     */

    static async authenticate(username, password) {
        // user search first
        const result = await db.query(
            `SELECT username,
                    password,
                    email
             FROM fitnessy_users
             WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            // compare passwords hashed
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password.");
    }

    /** Registers user.
     * 
     *  Returns User json.
     * 
     *  Throws BadRequestError on duplicates.
     */

    static async register({ username, password, email }) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM fitnessy_users
             WHERE username = $1`,
             [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        };

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO fitnessy_users
             (username,
              password,
              email)
             VALUES ($1, $2, $3)
             RETURNING username, email`,
             [username, hashedPassword, email],
        );

        const user = result.rows[0];

        return user;
    }

 /** Given a username, return data about user.
   *
   * Returns { username, email }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  email
           FROM fitnessy_users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

    /** Deletes user; returns undefined. */

    static async remove(username) {
        // let existingUser = await db.query(
        //     `SELECT *
        //      FROM fitnessy_users
        //      WHERE username = $1
        //      `,
        //      [username]
        // );

        // if (!existingUser) throw new NotFoundError()

        let result = await db.query(
            `DELETE
            FROM fitnessy_users
            WHERE username = $1
            RETURNING username`,
            [username],
        );
        
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }

}

module.exports = User;