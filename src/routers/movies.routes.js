const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");

const moviesRoutes = Router();
const movieController = new MoviesController();

moviesRoutes.get("/", movieController.index);

module.exports = moviesRoutes;
