import AccountService from "../service/authService";
import transporter from "../config/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
class AccountController {
  async login(req, res) {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      res.status(400).send("UsernameOrPassword are required");
    }
    try {
      const account = await AccountService.authenticate(
        usernameOrEmail,
        password
      );
      // if (account) {
      //   res.redirect("/");
      // } else {
      //   res.status(401).send("Invalid Username Or Password");
      // }
      if (account.error) {
        return res.render("login", { error: account.error });
      }
      req.session.userID = account.AccountID;
      res.redirect("/updatePassword");
    } catch (err) {
      console.error("Error excuting query:", err.stack);
      res.status(500).send("Database query error");
    }
  }
  async register(req, res) {
    const { username, password, email, phone } = req.body;
    const roleID = 1;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    try {
      if (!username || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }

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
    res.render("login", {
      usernameOrEmail: "",
      password: "",
    });
  }
  async showRegister(req, res) {
    res.render("register", {
      error: null,
      username: "",
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
      // account.IsActive = true;
      // account.verificationToken = null;
      // await account.save();
      res.status(200).send("Email has been successfully verified ");
    } catch (error) {
      res.status(500).send("Error verifying email: ", error.message);
    }
  }
  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const AccountId = req.session.userID; // Assuming you have userId from session or JWT token

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    try {
      const account = await AccountService.getAccountById(AccountId);
      if (!account) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compareSync(currentPassword, account.Password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      account.Password = hashedNewPassword;
      await account.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password: " + error.message });
    }
  }

  async showupdatePassword(req, res) {
    res.render("updatePassword", {
      currentPassword: "",
      newPassword: "",
    });
  }
}

module.exports = new AccountController();
