import express from "express";
import homepageController from "../controllers/homepageController";
import AccountController from "../controllers/authController";
import BookingController from "../controllers/dentistController";
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
  router.get("/pageAdmin", AccountController.showPageAdmin);
  router.post("/pageAdmin", AccountController.addAccountFromAdmin);
  router.get("/pageOwner", AccountController.showOwnerPage);
  router.get("/pageDentist", AccountController.showDentistPage);
  router.get("/schedule", AccountController.showSchedule);
  router.post("/schedule", AccountController.schedule);
  router.get("/datlich", BookingController.getAvailableSlot);
  router.post("/datlich", BookingController.schedule);
  router.get("/booking", BookingController.getDentistSchedules);
  router.get("/slotsByDate", BookingController.getSlotsByDate);
  router.post("/booking", BookingController.createBooking);
  return app.use("/", router);
};

module.exports = initAllWebRoutes;
