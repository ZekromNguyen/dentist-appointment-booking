import express from "express";
import homepageController from "../controllers/homepageController";
import AccountController from "../controllers/authController";
import BookingController from "../controllers/bookingController";
import LocationController from "../controllers/locationController";
import RegisterController from "../controllers/RegisterController";
import ClinicController from "../controllers/clinicController";
// init all web routes

let router = express.Router();

let initAllWebRoutes = (app) => {
  router.get("/", homepageController.getHomepage);
  router.get("/login", AccountController.showLogin);
  router.post("/login", AccountController.login);
  router.get("/register", AccountController.showRegister);
  router.post("/register", AccountController.registerCustomer);
  router.get("/verify", AccountController.verifyEmail);
  router.get("/showAccount", AccountController.showHomeAccount);
  router.get("/booking", BookingController.getAvailableSlot);
  router.get("/clinic", LocationController.showLocation);
  router.post("/clinic", RegisterController.registerClinic);
  router.get("/dentist", ClinicController.showDentist);
  router.post("/dentist", AccountController.registerDentist);
  return app.use("/", router);
};

module.exports = initAllWebRoutes;
