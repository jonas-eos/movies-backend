const knex = require("../database/knex");
const AppError = require("../utils/AppErrors");

class MoviesController {

  /**
   * List all movies registered on system
   *
   * @returns All movies with title, description and rating information
   */
  async index(request, response) {
    const { user_id, title, tags } = request.query;

    if (!user_id) {
      throw new AppError("User id is required!");
    }

    let movies;

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());

      movies = await knex("tags")
        .select([
          "movies.id",
          "movies.title",
          "movies.description",
          "movies.rating"
        ])
        .where("movies.user_id", user_id)
        .whereLike("movies.title", `%${title || ''}`)
        .whereIn("tags.name", filterTags)
        .innerJoin("movies", "movies.id", "tags.movie_id")
        .orderBy("movies.title");

    } else {

      movies = await knex("movies")
        .select("id", "title", "description", "rating")
        .where({ user_id })
        .whereLike("title", `%${title || ''}%`)
        .orderBy("title");
    };

    const userTags = await knex("tags")
      .where({ user_id });


    const moviesWithTags = movies.map(movie => {
      const movieTag = userTags.filter(tag => tag.movie_id === movie.id);

      return {
        title: movie.title,
        description: movie.description,
        rating: movie.rating,
        tags: movieTag.map(tag => tag.name)
      };
    });

    return response.json(moviesWithTags);
  };

  /**
   * Show the movie title, description, rating and the user that input the movie data note
   *
   * @param {Object} request movie id passed by params
   * @returns The movie data
   */
  async show(request, response) {
    const { id, user_id } = request.params;

    const movie = await knex("movies")
      .select("movies.id", "movies.title", "movies.description", "movies.rating", "movies.user_id")
      .where({ id })
      .first();

    if (!movie || movie.user_id !== Number(user_id)) {
      throw new AppError("This movie doesn't not exists");
    };

    const userTags = await knex("tags")
      .where({ user_id });

    const movieTag = userTags.filter(tag => tag.movie_id === movie.id);

    const movieWithTag = {
      title: movie.title,
      description: movie.description,
      rating: movie.rating,
      tags: movieTag.map(tag => tag.name)
    };

    return response.json(movieWithTag);
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
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("The user informed doesn't exists!");
    };

    if (!user_id) {
      throw new AppError("The user is required!");
    };

    if (!title) {
      throw new AppError("The movie title is required!");
    };

    if (!description) {
      throw new AppError("The movie description is required!");
    };

    if (rating < 1 || rating > 5) {
      throw new AppError("The rating score must be between 1 and 5!");
    };

    const movie_id = await knex("movies").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        user_id,
        name,
      };
    });

    await knex("tags").insert(tagsInsert);

    return response.status(201).json();
  };

  /**
   * Update movie information if informed, to update the movie information, the user id must match the user id registered in movie
   *  that want to update information, but first must check if exists the movie registered and the user.
   *  The rating score must be between 1 and 5, else must return a error message with information.
   *  If one of the information like title, description or rating has no passed in body, the api must get the registered data and
   *  save again on knex update method.
   *
   * @param {Object} request The movie id and user_id passed by params and title, description and rating
   * @returns THe success status of update request
   */
  async update(request, response) {
    const { id, user_id } = request.params;
    let { title, description, rating } = request.body;

    if (!id) {
      throw new AppError("You must inform which movie do you want to update!");
    };

    if (!user_id) {
      throw new AppError("You must inform which user has created the movie note!");
    };

    const movie = await knex("movies").where({ id }).first();
    const user = await knex("users").where({ id: user_id }).first();

    if (!movie) {
      throw new AppError("This movie doesn't not exists!");
    };

    if (!user || user.id !== movie.user_id) {
      throw new AppError("The user is incorrect!");
    };

    if (rating < 1 || rating > 5) {
      throw new AppError("The rating score must be between 1 and 5!");
    };

    title = title ?? movie.title;
    description = description ?? movie.description;
    rating = rating ?? movie.rating;

    await knex("movies")
      .update({ title, description, rating })
      .where({ id });

    return response.json();
  };

  /**
   * Delete a movie, but first check if passed the id and user id as params, after that search the movie
   *  by movie id informed, and check if the movie user id match with the user id passed as params,
   *  if all rules is ok, delete the movie.
   *
   * @param {Object} request The movie id and user id passed by params
   * @returns The success status of delete request
   */
  async delete(request, response) {
    const { id, user_id } = request.params;

    if (!id) {
      throw new AppError("You must inform which movie do you want to update!");
    };

    if (!user_id) {
      throw new AppError("You must inform which user has created the movie note!");
    };

    const movie = await knex("movies")
      .where({ id })
      .first();

    if (!movie) {
      throw new AppError("This movie doesn't not exists!");
    };

    if (Number(user_id) !== movie.user_id) {
      throw new AppError("The user is incorrect!");
    };

    await knex("movies").where({ id }).delete();

    return response.json();
  };
};

module.exports = MoviesController;
