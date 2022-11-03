const knex = require("../database/knex");

class MoviesController {

  /**
   * List all movies registered on system
   *
   * @returns All movies with title, description and rating information
   */
  async index(_request, response) {
    const movies = await knex("movies")
    .select("title", "description", "rating")
    .orderBy("title");

    return response.json(movies);
  };
};

module.exports = MoviesController;
