import express from "express";
import homepageController from "../controllers/homepageController";
import AccountController from "../controllers/authController";
import DentistController from "../controllers/dentistController";
import BookingController from "../controllers/bookingController";
import dentistController from "../controllers/dentistController";
import TreatmentController, {
  upload,
} from "../controllers/treatmentController";
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
  router.post("/logout", AccountController.logout);
  router.get("/get-session", AccountController.getSession);
  router.get("/booking", BookingController.getDentistSchedules);
  router.post("/booking", BookingController.createBooking);
  router.get("/slotsByDate", BookingController.getSlotsByDateByDentistService);
  router.get(
    "/getDentistSchedule",
    DentistController.getDentistScheduleByDentistId
  );
  //get lịch của 1 dentist nếu đã có booking thì sẽ hiện cả CustomerName đã booking
  //ex: /getDentistSchedule?dentistId=1

  router.get(
    "/getBookingDetail",
    BookingController.getDentistNameByBookingDetail
  );
  //get CustomerName và SlotTime customer DentistName của 1 bookingdetail nếu đã booking
  //ex: /getBookingDetail?BookingDetailID=1

  router.get("/getAllClinic", AccountController.getAllClinic);
  router.get("/getAllBooking", BookingController.getAllBooking);

  ///////////////////////////user
  router.post("/handleCreateUser", AccountController.handleCreateUser);
  router.get("/getAllUser", AccountController.handleGetAllUser);
  router.delete("/deleteUser", AccountController.handleDeleteUser);
  router.get("/handleGetAllCustomer", AccountController.handleGetAllCustomer);

  ///////////////////////////customer
  router.put("/editCustomer", AccountController.handleUpdateCustomer);
  router.put("/editUser", AccountController.handleEditUser);

  /////////////////////////////dentist
  router.get("/handleGetAllDentist", dentistController.handleGetAllDentist);
  router.delete("/handleDeleteDentist", dentistController.handleDeleteDentist);
  router.put("/handleEditDentist", dentistController.handleEditDentist);

  /**************************Nam New API***************/
  router.get("/getAllDentists", DentistController.getAllDentist);
  router.get("/scheduleSlot", DentistController.getAvailableSlotN);
  router.get("/scheduleDentist", DentistController.getDentistSchedules);
  router.get("/getCustomerId", AccountController.getCustomerId);

  router.get("/payment/:bookingId", BookingController.showPaymentPage);
  router.post("/payment", BookingController.processPayment);

  router.get("/treatment", TreatmentController.getAllTreatments);
  router.post(
    "/treatments",
    upload.single("Result"),
    TreatmentController.createTreatment
  );

  return app.use("/", router);
};

module.exports = initAllWebRoutes;
