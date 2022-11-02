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

    const userExist = await knex("users").where( {email} );

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
