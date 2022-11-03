const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();
const userController = new UsersController();

usersRoutes.post("/", userController.create);
usersRoutes.get("/", userController.index);
usersRoutes.get("/:user_id", userController.show);

module.exports = usersRoutes;
