import axios from "axios";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class FitNessyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${FitNessyApi.token}` };
    const params = (method === "get")
        ? data
        : {};
    console.debug(url);
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get exercises */
  static async getExercises() {
    let res = await this.request(`exercises`);
    return res;
  };

  /** Get one exercise */
  static async getExercise(id) {
    let res = await this.request(`exercises/${id}`);
    return res;
  };

  /** Login */
  static async login(data) {
    let res = await this.request(`token`, data, "post");
    if (res.token) {
      localStorage.setItem('fitnessy-token', res.token);
      FitNessyApi.token = res.token;
    }
    return res.token;
  };

  /** Register */
  static async signup(data) {
    let res = await this.request(`register`, data, "post");
    return res.token;
  }

  /** Get current user */
  static async getCurrentUser(username) {
    console.log(`Token used: Bearer ${FitNessyApi.token}`);

    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get user exercises by date*/
  static async getExercisesByDate(username, date) {
    let res = await this.request(`${username}/workouts/${date}`);
    console.log(res);
    return res
  };

  /** Add exercise */
  static async addExercise(username, data) {
    let res = await this.request(`${username}/workouts`, data, "post");
    console.log(res);
    return res;
  };

  /** Patch and update exercise */
  static async updateExercise(username, user_exercise_id, data) {
    let res = await this.request(`${username}/workouts/${user_exercise_id}`, data, "patch");
    console.log(res);
    return res;
  };

  /** Delete exercise */
  static async deleteExercise(username, exerciseId) {
    let res = await this.request(`${username}/workouts/${exerciseId}`, {}, "delete");
    console.log(res);
    return res;
  };
}


export default FitNessyApi;