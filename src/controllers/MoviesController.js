const knex = require("../database/knex");
const AppError = require("../utils/AppErrors");

class MoviesController {

  /**
   * List all movies registered on system
   *
   * @returns All movies with title, description and rating information
   */
  async index(_request, response) {
    const movies = await knex("movies")
    .select("movies.title", "movies.description", "movies.rating", "users.name")
    .innerJoin("users", "users.id", "movies.user_id")
    .orderBy("movies.title");

    return response.json(movies);
  };

  /**
   * Show the movie title, description, rating and the user that input the movie data note
   *
   * @param {Object} request movie id passed by params
   * @returns The movie data
   */
  async show(request, response) {
    const { id } = request.params;

    const movie = await knex("movies")
    .select("movies.title", "movies.description", "movies.rating", "users.name")
    .where("movies.id", id)
    .innerJoin("users", "users.id", "movies.user_id")
    .first();

    return response.json(movie);
  };

  /**
   * Create a new movie notes with title, description and rating, the rating score must be between
   *  1 and 5, else the app must be return with error, before register the movie notes, must check if passed user_id
   *  if not passed, the app must inform that must inform the user_id, and another check that must be do before
   *  create the new registry, is if the user have a register.
   *  title and description are mandatory.
   *
   * @param {Object} request body content with title, description and rating, params with user_id
   * @returns the success status 201
   */
  async create(request, response) {
    const { title, description, rating } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({id: user_id}).first();

    if(!user) {
      throw new AppError("The user informed doesn't exists!");
    };

    if(!user_id) {
      throw new AppError("The user is required!");
    };

    if (!title) {
      throw new AppError("The movie title is required!");
    };

    if(!description) {
      throw new AppError("The movie description is required!");
    };

    if(rating < 1 || rating > 5) {
      throw new AppError("The rating score must be between 1 and 5!");
    };

    await knex("movies").insert({
      title,
      description,
      rating,
      user_id,
    })

    return response.status(201).json();
  };
};

module.exports = MoviesController;
