import { Router } from "express";
import AccountController from "../controllers/authController";

const router = Router();
router.get("/login", AccountController.showLogin);
router.post("/login", AccountController.login);
router.get("/register", AccountController.showRegister);
router.post("/register", AccountController.register);

module.exports = router;
