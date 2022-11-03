const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppErrors");

class UsersController {
  /**
   * List all users registered but show only name and email.
   *
   * @returns All usernames and user emails registered
   */
  async index(_request, response) {
    const users = await knex("users")
      .select("name", "email")
      .orderBy("name");

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

  /**
   * Update user information if informed, if te user pass password, they must pass old password too,
   *  else the app must stop the update progress and inform that the use doesn't pass the old password,
   *  another important point is that the user email can't exist in another user registry, if exists the app
   *  must throw a error with information that the email has already registered by another person.
   *
   * @param {Object} request The name, email, password and old password pass throw body and user id from params
   * @returns The success status of update request
   */
  async update(request, response) {
    let { name, email, password, old_password } = request.body;
    const { user_id } = request.params;

    const user = await knex("users")
      .where({ id: user_id })
      .first();

    if (!user) {
      throw new AppError("User does not exists!");
    };

    const emailHasAlreadyRegistered = await knex("users")
      .where({ email })
      .first();

    if (emailHasAlreadyRegistered && emailHasAlreadyRegistered.id !== user.id) {
      throw new AppError("This email has already registered!");
    };

    name = name ?? user.name;
    email = email ?? user.email;

    if (password) {
      if (!old_password) {
        throw new AppError("You must inform the old password to create the new one!");
      };

      const oldPasswordMatch = await compare(old_password, user.password);

      if (!oldPasswordMatch) {
        throw new AppError("The old password is incorrect!");
      };

    };
    password = password ? await hash(password, 8) : user.password;

    await knex("users")
      .update({ name, email, password })
      .where({ id: user_id });

    return response.json();
  };
};

module.exports = UsersController;
