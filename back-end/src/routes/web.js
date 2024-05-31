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
  return app.use("/", router);
};

module.exports = initAllWebRoutes;
