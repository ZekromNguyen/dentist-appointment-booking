import express from "express";
import homepageController from "../controllers/homepageController";
import AccountController from "../controllers/authController";

// init all web routes

let router = express.Router();

let initAllWebRoutes = (app) => {
  router.get("/", homepageController.getHomepage);
  router.get("/login", AccountController.showLogin);
  router.post("/login", AccountController.login);
  router.get("/register", AccountController.showRegister);
  router.post("/register", AccountController.register);
  router.get("/verify", AccountController.verifyEmail);
  router.get("/updatePassword", AccountController.showupdatePassword);
  router.post("/updatePassword", AccountController.updatePassword);
  router.get("/forgotPassword", AccountController.showForgotPassword);
  router.post("/forgotPassword", AccountController.forgotPassword);
  router.get("/resetPassword", AccountController.showresetPassword);
  router.post("/resetPassword", AccountController.resetPassword);
  return app.use("/", router);
};

module.exports = initAllWebRoutes;
