import express from "express";
import homepageController from "../controllers/homepageController";
<<<<<<< HEAD
import AccountController from "../controllers/authController";
=======
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f

// init all web routes

let router = express.Router();

let initAllWebRoutes = (app) => {
<<<<<<< HEAD
  router.get("/", homepageController.getHomepage);
  router.get("/login", AccountController.showLogin);
  router.post("/login", AccountController.login);
  router.get("/register", AccountController.showRegister);
  router.post("/register", AccountController.register);
  router.get("/verify", AccountController.verifyEmail);
  return app.use("/", router);
=======
    router.get("/", homepageController.getHomepage);
    
    return app.use("/", router);
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
};

module.exports = initAllWebRoutes;
