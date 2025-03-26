const express = require("express");
const userController = require("../Controllers/UserControllers");

const UserRouter = express.Router();

UserRouter.post("/register", userController.registerUser);
UserRouter.post("/login", userController.loginUser);
UserRouter.post("/resendOTP", userController.loginUser);
UserRouter.post("/verifyOTP", userController.verifyOtp);
UserRouter.post("/register", userController.createUser);
UserRouter.get("/get", userController.getUsers);
UserRouter.put("/update/:id", userController.updateUser);
UserRouter.delete("/delete/:id", userController.deleteUser);

module.exports = UserRouter;