import AccountService from "../service/authService";
import transporter from "../config/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Account from "../model/account";
class AccountController {
  // async login(req, res) {
  //   const { usernameOrEmail, password } = req.body;
  //   if (!usernameOrEmail || !password) {
  //     res.status(400).send("UsernameOrPassword are required");
  //   }
  //   try {
  //     const account = await AccountService.authenticate(
  //       usernameOrEmail,
  //       password
  //     );
  //     if (account.error) {
  //       return res.render("login", { error: account.error });
  //     }
  //     const role = account.RoleID;
  //     req.session.userID = account.AccountID;
  //     switch (role) {
  //       case 1:
  //         res.redirect("/updatePassword");
  //         break;
  //       case 2:
  //         res.redirect("/pageDentist");
  //         break;
  //       case 3:
  //         res.redirect("/pageOwner");
  //         break;
  //       case 4:
  //         res.redirect("/accountManager");
  //         break;
  //     }
  //   } catch (err) {
  //     console.error("Error excuting query:", err.stack);
  //     res.status(500).send("Database query error");
  //   }
  // }
  async login(req, res) {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).send("UsernameOrPassword are required");
    }
    try {
      const account = await AccountService.authenticate(usernameOrEmail, password);
      if (account.error) {
        return res.render("login", { error: account.error });
      }

      if (!account.IsActive) {
        // Generate reset token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await AccountService.createResetToken(account.Email, verificationToken);
        const verificationLink = `http://localhost:3000/resetPassword?token=${verificationToken}`;

        // Send email to reset password
        const mailOptions = {
          from: process.env.EMAIL_APP_GMAIL,
          to: account.Email,
          subject: "Reactivate Your Account",
          text: `Your account is inactive. Please reset your password to reactivate your account by clicking the following link: ${verificationLink}`,
          html: `<p>Your account is inactive. Please reset your password to reactivate your account by clicking the following link: <a href="${verificationLink}">Reset Password</a></p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).send(error.toString());
          }
          res.status(200).send(`Your account is inactive. A reset password email has been sent to: ${account.Email}`);
        });

        return;
      }

      req.session.userID = account.AccountID;
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Internal server error");
        }
        const role = account.RoleID;
        switch (role) {
          case 1:
            return res.redirect("/updatePassword");
          case 2:
            return res.redirect("/pageDentist");
          case 3:
            return res.redirect("/pageOwner");
          case 4:
            return res.redirect("/accountManager");
          default:
            return res.status(400).send("Invalid role");
        }
      });
    } catch (err) {
      console.error("Error executing query:", err.stack);
      return res.status(500).send("Database query error");
    }
  }

  // Other methods...

  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid', { path: '/' });
      return res.redirect('/login');
    });
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
      const newAccount = await AccountService.createAccountCustomer({
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
      res.status(200).send("Email has been successfully verified ");
    } catch (error) {
      res.status(500).send("Error verifying email: ", error.message);
    }
  }
  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const AccountId = req.session.userID; // Assuming you have userId from session or JWT token

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }

    try {
      const account = await AccountService.getAccountById(AccountId);
      if (!account) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compareSync(
        currentPassword,
        account.Password
      );
      console.log(isMatch);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      account.Password = hashedNewPassword;
      await account.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating password: " + error.message });
    }
  }

  async showupdatePassword(req, res) {
    res.render("updatePassword", {
      currentPassword: "",
      newPassword: "",
    });
  }
  async showForgotPassword(req, res) {
    res.render("forgotPassword");
  }
  async forgotPassword(req, res) {
    const { email } = req.body;
    console.log(email);
    const newAccount = await AccountService.getAccountByUserNameOrEmail(email);
    if (!newAccount) {
      return res
        .status(400)
        .json({ message: `Not found account with email ${email}` });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `http://localhost:3000/resetPassword?token=${verificationToken}`;
    const account = await AccountService.createResetToken(
      email,
      verificationToken
    );
    if (!account) {
      console.log("Not found account in controller");
    }
    const mailOptions = {
      from: process.env.EMAIL_APP_GMAIL,
      to: email,
      subject: "Email ResetPassword",
      text: `Please resetPassword your account by clicking the following link: ${verificationLink}`,
      html: `<p>Please resetPassword your account by clicking the following link: <a href="${verificationLink}">Verify ResetPassword</a></p>`,
    };
    console.log("Request body:", req.body);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).send(error.toString());
      }
      res.status(200).send(`A resetPassword email has been sent to: ${email}`);
    });
  }
  async showresetPassword(req, res) {
    const { token } = req.query;
    const account = await AccountService.getResetToken(token);
    if (!account) {
      res.status(400).json({ message: "Invalid reset token" });
    }
    const id = account.AccountID;
    res.render("resetPassword", { id });
  }
  async resetPassword(req, res) {
    const { password, confirmPassword, id } = req.body;
    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and corfim Password not same" });
    }
    const hasedpassword = bcrypt.hashSync(password, 10);
    const account = await AccountService.saveNewPassword(id, hasedpassword);
    if (!account) {
      console.log(`Not found account with id ${id}`);
    }
    res.status(200).json({ message: "Reset password successfully" });
  }
  async showPageAdmin(req, res) {
    res.render("admin");
  }
  async addAccountFromAdmin(req, res) {
    const { username, password, email, phone, roleID } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const newAccount = await AccountService.createAccountDentistOrOwner({
        username,
        hashedPassword,
        phone,
        email,
        roleID,
      });
      if (newAccount) {
        res.status(200).json({ message: "Create Account Successfully" });
      }
    } catch (err) {
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
  async showOwnerPage(req, res) {
    res.render("owner");
  }
  async showDentistPage(req, res) {
    res.render("dentist");
  }

  async showSchedule(req, res) {
    res.render("schedule", {
      day: "",
      stime: "",
      etime: "",
    });
  }

  async schedule(req, res) {
    const { day, stime, etime, dentistId } = req.body; // Đảm bảo rằng dentistId được lấy từ req.body
    const DentistID = req.session.userID || dentistId; // Sử dụng dentistId từ request body hoặc session
    if (!DentistID) {
      return res.status(400).send("DentistID is required");
    }
    try {
      const newSchedule = await AccountService.createSchedule({
        DentistID,
        day,
        stime,
        etime
      });
      res.status(200).send("Schedule added successfully", newSchedule);
    } catch (error) {
      res.status(500).send("Error adding schedule: " + error.message);
    }
  }

  async getAccountsPage(req, res) {
    try {
      const accounts = await AccountService.getAllAccounts();
      res.render("accountManager", { accounts });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  async activateAccount(req, res) {
    try {
      const accountId = req.params.id;
      const account = await AccountService.getAccountById(accountId);
      if (!account) {
        return res.status(404).send("Account not found");
      }
      account.IsActive = !account.IsActive;
      await account.save();
      res.redirect("/accountManager"); // Corrected redirect path
    } catch (error) {
      console.error("Error activating account:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  async deleteAccount(req, res) {
    try {
      const accountId = req.params.id;
      const account = await AccountService.getAccountById(accountId);
      if (!account) {
        return res.status(404).send("Account not found");
      }
      await account.destroy();
      res.redirect("accountManager");
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/login');
    });
  }


}

export default new AccountController();