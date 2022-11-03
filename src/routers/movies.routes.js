const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");

const moviesRoutes = Router();
const movieController = new MoviesController();

moviesRoutes.get("/", movieController.index);
moviesRoutes.post("/:user_id", movieController.create);

module.exports = moviesRoutes;
