const { Router } = require("express");
const moviesRoutes = require("./movies.routes");
const usersRoutes = require("./users.routes");

const routers = Router();

routers.use("/users", usersRoutes);
routers.use("/movies", moviesRoutes);

module.exports = routers;
