const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();
const userController = new UsersController();

usersRoutes.post("/", userController.create);
usersRoutes.get("/", userController.index);

module.exports = usersRoutes;
