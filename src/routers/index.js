const { Router } = require("express");
const usersRoutes = require("./users.routes");

const routers = Router();

routers.use("/users", usersRoutes);

module.exports = routers;
