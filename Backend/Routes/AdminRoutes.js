const express = require("express");
const adminController = require("../Controllers/AdminControllers");

const AdminRouter = express.Router();

AdminRouter.post("/register", adminController.registerAdmin);
AdminRouter.post("/login", adminController.loginAdmin);
AdminRouter.put("/change-password/:id", adminController.changePassword);
AdminRouter.get("/get", adminController.getAdmins);
AdminRouter.put("/update/:id", adminController.updateAdmin);
AdminRouter.delete("/delete/:id", adminController.deleteAdmin);
AdminRouter.post("/forgot-password", adminController.forgotPassword);
AdminRouter.post("/verifyOTP", adminController.verifyOtp);
AdminRouter.post("/reset-password", adminController.resetPassword);

module.exports = AdminRouter;