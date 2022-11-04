const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");

const moviesRoutes = Router();
const movieController = new MoviesController();

moviesRoutes.get("/", movieController.index);
moviesRoutes.get("/:id/:user_id", movieController.show);
moviesRoutes.post("/:user_id", movieController.create);
moviesRoutes.put("/:id/:user_id", movieController.update);
moviesRoutes.delete("/:id/:user_id", movieController.delete);

module.exports = moviesRoutes;
