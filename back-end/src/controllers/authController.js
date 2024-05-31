import AccountService from "../service/authService";
<<<<<<< HEAD
import transporter from "../config/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import e from "express";
=======

>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
class AccountController {
  async login(req, res) {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      res.status(400).send("UsernameOrPassword are required");
    }
<<<<<<< HEAD
=======

>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
    try {
      const account = await AccountService.authenticate(
        usernameOrEmail,
        password
      );
<<<<<<< HEAD
      // if (account) {
      //   res.redirect("/");
      // } else {
      //   res.status(401).send("Invalid Username Or Password");
      // }
      if (account.error) {
        return res.render("login", { error: account.error });
      }
      res.redirect("/");
=======
      if (account) {
        res.redirect("/");
      } else {
        res.status(401).send("Invalid Username Or Password");
      }
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
    } catch (err) {
      console.error("Error excuting query:", err.stack);
      res.status(500).send("Database query error");
    }
  }
  async register(req, res) {
    const { username, password, email, phone } = req.body;
    const roleID = 1;
<<<<<<< HEAD
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
=======
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
    try {
      if (!username || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }
<<<<<<< HEAD

      console.log("Hashed password:", hashedPassword);
      const mailOptions = {
        from: process.env.EMAIL_APP_GMAIL,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
      };
      console.log("Request body:", req.body);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send(error.toString());
        }
        res.status(200).send("A verification email has been sent to:", email);
      });
      const newAccount = await AccountService.createAccount({
        username,
        hashedPassword,
        phone,
        email,
        roleID,
        verificationToken,
=======
      console.log("Request body:", req.body);
      const newAccount = await AccountService.createAccount({
        username,
        password,
        phone,
        email,
        roleID,
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
      });
      console.log("Account create:", newAccount);
      if (newAccount) {
        res.redirect("/login");
      }
    } catch (err) {
      //console.error("Error inserting into the database:", err.stack);
      if (err.message === "Email already exists") {
        return res.render("register", {
          error: "Email already taken",
          username: username,
          email: email,
          phone: phone,
        });
      }
      if (err.message === "Username already exists") {
        return res.render("register", {
          error: "Username already taken",
          username: username,
          email: email,
          phone: phone,
        });
      }
      res.status(500).send("Database insert error");
    }
  }
  async showLogin(req, res) {
<<<<<<< HEAD
    res.render("login", {
      usernameOrEmail: "",
      password: "",
    });
=======
    res.render("login");
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
  }
  async showRegister(req, res) {
    res.render("register", {
      error: null,
      username: "",
<<<<<<< HEAD
      password: "",
      email: "",
      phone: "",
    });
  }
  async verifyEmail(req, res) {
    const { token } = req.query;
    try {
      const account = await AccountService.getTokenVerify(token);
      if (!account) {
        return res.status(400).send("Invalid verification token");
      }
      account.IsActive = true;
      account.verificationToken = null;
      await account.save();
      res.status(200).send("Email has been successfully verified ");
    } catch (error) {
      res.status(500).send("Error verifying email: ", error.message);
    }
  }
=======
      email: "",
    });
  }
>>>>>>> 442d12e496e31c03ebeccdb33eb39517b4e2981f
}

module.exports = new AccountController();
