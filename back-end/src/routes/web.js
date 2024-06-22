import express from "express";
import homepageController from "../controllers/homepageController";
import AccountController from "../controllers/authController";
import DentistController from "../controllers/dentistController";
import BookingController from "../controllers/bookingController";
// init all web routes

let router = express.Router();

let initAllWebRoutes = (app) => {
  router.get("/", homepageController.getHomepage);
  router.get("/login", AccountController.showLogin);
  router.post("/login", AccountController.login);
  router.get("/register", AccountController.showRegister);
  router.post("/register", AccountController.registerCustomer);
  router.post("/registerDentist", AccountController.registerDentist);
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
  router.get("/schedule", DentistController.getAvailableSlot);
  router.post("/schedule", DentistController.createScheduleForDentist);
  router.get("/getAllUser", AccountController.handleGetAllUser);
  router.put("/editUser", AccountController.handleEditUser);
  router.delete("/deleteUser", AccountController.handleDeleteUser);
  router.post("/logout", AccountController.logout);
  router.get("/get-session", AccountController.getSession);
  router.get("/booking", BookingController.getDentistSchedules);
  router.post("/booking", BookingController.createBooking);
  router.get("/slotsByDate", BookingController.getSlotsByDateByDentistService);
  
  /**************************Nam New API***************/
  router.get("/getAllDentists", AccountController.handleGetAllDentists);
  router.get("/scheduleSlot", DentistController.getAvailableSlotN);
  router.get("/scheduleDentist", DentistController.getDentistSchedules);
  router.get("/getCustomerId", AccountController.getCustomerId);





  router.get("/payment/:bookingId", BookingController.showPaymentPage);
  router.post("/payment", BookingController.processPayment);

  return app.use("/", router);
};

module.exports = initAllWebRoutes;
