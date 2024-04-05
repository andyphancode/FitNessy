"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { authenticateJWT, ensureCorrectUser } = require("./middleware/auth");
const jsonschema = require("jsonschema");

const addExerciseSchema = require("./schemas/addExercise.json");
const updateExerciseSchema = require("./schemas/updateExercise.json");
const userAuthSchema = require("./schemas/userAuth.json");
const userRegisterSchema = require("./schemas/userRegister.json");

const { createToken } = require("./helpers/tokens");
const { NotFoundError, BadRequestError } = require("./expressError");
const Exercise = require("./models/exercise");
const User = require("./models/user");
const Workout = require("./models/workout");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/** GET / 
 * 
 * Just a simple landing page.
 * 
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FitNessy backend." });
});


/** POST /token: { username, password } => { token }
 * 
 * Returns JWT token which can be used to authenticate requests
 * 
 * No authorization required.
 */
app.post("/token", async function( req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
        return next(err);
  }
});

/** POST /register: { username, password, email } => { token }
 * 
 * Returns JWT token which can be used to authenticate requests
 * 
 * No authorization required.
 */

app.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body});
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }    
})

/** GET /users/[username] => { user }
 * 
 * Returns { username, email }
 * 
 * Authorization required is same user.
 */
app.get("/users/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch(err) {
    return next(err);
  }
}) 

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username
 **/

app.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** GET /exercises => { exercise data } 
 * 
 * Recieves entirety of exercise data.
 * 
 * Authorization not required.
 */
app.get("/exercises", async function (req, res, next) {
    try {
        const exercises = await Exercise.getExercises();
        return res.json(exercises);
    } catch (err) {
        return next(err);
    }
});

/** GET /exercises/:exercise_id => { exercise data } 
 * 
 * Receives 1 specific exercise entry.
 * 
 * Authorization not required.
*/
app.get("/exercises/:exercise_id", async function (req, res, next) {
  try {
    const exercise = await Exercise.get(req.params.exercise_id);
    return res.json(exercise);
  } catch (err) {
    return next(err)
  }
})

/** GET /:username/workouts/:date => { exercise data }
 * 
 * Receives all exercises done on workout of given date by given user.
 * 
 * Authorization required: same as current user.
 */
app.get("/:username/workouts/:date", ensureCorrectUser, async function (req, res, next) {
    try {
        const exercises = await Workout.getExercisesByDate(req.params.username,req.params.date);
        return res.json(exercises)
    } catch (err) {
        return next(err);
    }
});

/** POST /:username/workouts/ { user_exercise data } => { "added": exercise_id }
 * 
 * user_exercise data should include {exercise_id, exercise_date, [...reps], [...rir]}. Returns {"added": addedExercise}
 * 
 * Authorization required: same as current user.
 */
app.post("/:username/workouts/", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, addExerciseSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const addedExercise = await Workout.addExercise(req.params.username, req.body);
        return res.status(201).json({ "added": addedExercise });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /:username/workouts/:user_exercises_id { update data } => { updated exercise data }
 * 
 * { update data } should include { exerciseId, [...reps], [...rir] }. Returns { "updated": updatedExercise }
 * 
 * Authorization required: same as current user.
 */
app.patch("/:username/workouts/:user_exercise_id", ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateExerciseSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const updatedExercise = await Workout.updateExercise(req.params.username, req.params.user_exercise_id, req.body);
        return res.status(201).json({ "updated": updatedExercise })
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:username/workouts/:user_exercise_id => { exercise data }
 * 
 * Deletes a certain user_exercise. Returns delete exercise data.
 * 
 * Authorization required: same as current user.
 */
app.delete("/:username/workouts/:user_exercise_id", ensureCorrectUser, async function (req, res, next) {
    try {
        const deletedExercise = await Workout.deleteExercise(req.params.username,req.params.user_exercise_id);
        return res.json({ "deleted": deletedExercise })
    } catch (err) {
        return next(err);
    }
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
