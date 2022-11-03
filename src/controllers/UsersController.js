const { hash } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppErrors");

class UsersController {
  /**
   * List all users registered but show only name and email.
   *
   * @returns All usernames and user emails registered
   */
  async index(_request, response) {
    const users = await knex("users").select("name", "email");

    return response.json(users);
  };

  /**
   * Show the user name and email, the request must by passed by params and must have
   *  the user id to be success.
   *
   * @param {Object} request user id informed by params
   * @returns The user data
   */
  async show(request, response) {
    const { user_id } = request.params;

    const user = await knex("users").select("name", "email").where({ id: user_id });

    return response.json(user);
  }

  /**
   * Create a new user, name, email and password are required, need check if
   *  has already a user with the filled email.
   *
   * @param {Object} request body content with name, email and password
   * @returns The success status 201
   */
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      throw new AppError("The name is required!");
    };

    if (!email) {
      throw new AppError("The email is required!");
    };

    if (!password) {
      throw new AppError("The password is required!");
    };

    const userExist = await knex("users").where({ email });

    if (userExist[0]) {
      throw new AppError("This email has already registered!");
    };

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  };
};

module.exports = UsersController;
