import AccountService from "../service/authService";
import transporter from "../config/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import authService from "../service/authService";
class AccountController {
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
    try {
      const account = await AccountService.authenticate(email, password);
      if (account.error) {
        return res.status(400).json({ error: account.error });
      }
      if (!account.IsActive) {
        // Generate reset token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await AccountService.createResetToken(account.Email, verificationToken);
        const verificationLink = `http://localhost:5173/ResetPassword?token=${verificationToken}`;

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
      req.session.user = {
        user: account.UserName,
        id: account.AccountID,
        RoleID: account.RoleID,
        IsActive: account.IsActive,
      };
      if (req.session.user) {
        res
          .status(200)
          .json({ message: "Login successfully", user: req.session.user });
      } else {
        res.status(500).json({ message: "Failed to set session" });
      }
    } catch (err) {
      console.error("Error executing query:", err.stack);
      res.status(500).send("Database query error");
    }
  }
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid"); // Tên cookie có thể khác tùy theo cấu hình của bạn
      res.status(200).json({ message: "Logout successfully" });
    });
  }
  async getSession(req, res) {
    if (req.session.user) {
      res.status(200).json(req.session.user);
    } else {
      res.status(401).json({ message: "No session found" });
    }
  }
  async registerCustomer(req, res) {
    const { username, password, email, phone, roleID, name } = req.body;
    try {
      if (!username || !password || !email || !phone || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log("Hashed password:", hashedPassword);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const newAccount = await AccountService.createAccountCustomer(
        username,
        hashedPassword,
        phone,
        email,
        roleID,
        verificationToken
      );
      const newCustomer = await AccountService.createCustomer(
        name,
        newAccount.AccountID
      );
      if (newAccount.verificationToken && newCustomer) {
        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
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
          res
            .status(200)
            .json({ message: "A verification email has been sent to:", email });
        });
      }
      console.log("Account create:", newAccount);
      console.log("Customer create:", newCustomer);
      return res
        .status(200)
        .json({ message: "Account customer create successfully" });
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
  async registerDentist(req, res) {
    const { username, password, email, phone, roleID, dentistName, clinicID } =
      req.body;
    try {
      if (!username || !password || !email || !phone || !dentistName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newAccount = await AccountService.createAccountDentistOrOwner(
        username,
        hashedPassword,
        phone,
        email,
        roleID
      );
      const newDentist = await AccountService.createDentist(
        dentistName,
        newAccount.AccountID,
        clinicID
      );
      console.log("Account create:", newAccount);
      console.log("Customer create:", newDentist);
      return res
        .status(200)
        .json({ message: "Account dentist create successfully" });
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
        return res.status(400).json({ message: "Invalid verification token" });
      }
      res
        .status(200)
        .json({ message: "Email has been successfully verified " });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying email: ", error: error.message });
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

      const isMatch = bcrypt.compareSync(currentPassword, account.Password);
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
    const verificationLink = `http://localhost:5173/ResetPassword?token=${verificationToken}`;
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
    res.status(200).json({ id });
  }

  async resetPassword(req, res) {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const updatedAccount = await AccountService.saveNewPasswordAndActivate(token, hashedPassword);

      if (!updatedAccount) {
        return res.status(400).json({ message: `No account found with token ${token}` });
      }

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
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
        etime,
      });
      res.status(200).send("Schedule added successfully", newSchedule);
    } catch (error) {
      res.status(500).send("Error adding schedule: " + error.message);
    }
  }
  ////////////////////////////////////
  async handleGetAllUser(req, res) {
    let AccountID = req.query.AccountID; // All, id
    if (!AccountID) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required patameter",
        account: [],
      });
    }
    let account = await AccountService.getAllUsers(AccountID);

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      account,
    });
  }

  async handleCreateUser(req, res) {
    const { username, password, email, phone } = req.body;
    const roleID = 1; // Assuming roleID for customer
    const saltRounds = 10; // Number of salt rounds

    try {
      if (!username || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate password length or complexity if needed
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Hash the password using bcrypt
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      // Call your service method to create the account
      const newAccount = await AccountService.createAccountWithoutVerification({
        username,
        hashedPassword,
        phone,
        email,
        roleID,
      });

      if (newAccount) {
        return res.status(200).json({ message: "Account created successfully" });
      }
    } catch (err) {
      // Handle specific errors if needed
      if (err.message === "Email already exists") {
        return res.status(400).json({ error: "Email already taken" });
      }
      if (err.message === "Username already exists") {
        return res.status(400).json({ error: "Username already taken" });
      }
      // Handle generic error
      res.status(500).json({ message: "Database insert error" });
    }
  }

  async handleDeleteUser(req, res) {
    const { AccountID } = req.body;
    if (!AccountID) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter",
      });
    }
    try {
      const message = await AccountService.deleteUser(AccountID);
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        errCode: 1,
        errMessage: "Error deleting user",
      });
    }
  }

  async handleEditUser(req, res) {
    try {
      let data = req.body;

      // Kiểm tra xem AccountID có tồn tại và không phải là undefined
      if (!data.AccountID) {
        return res.status(400).json({
          errCode: 2,
          errMessage: "ID người dùng không được cung cấp",
        });
      }

      // Gọi service để thực hiện cập nhật thông tin người dùng
      let message = await AccountService.handleUpdateUser(data);

      // Kiểm tra kết quả từ service
      if (message.errCode !== undefined && message.errCode !== 0) {
        // Nếu có lỗi từ service thì trả về lỗi
        return res.status(400).json(message);
      }

      // Trả về kết quả thành công nếu không có lỗi
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error in handleEditUser:", error);
      // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
      return res.status(500).json({
        errCode: 1,
        errMessage: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    }
  }

  async handleGetAllDentist(req, res) {
    let DentistID = req.query.DentistID;
    if (!DentistID) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        account: []
      })
    }
    let account = await AccountService.getAllDentist(DentistID);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      account,
    })
  }

  async handleDeleteDentist(req, res) {
    const { DentistID } = req.body;
    if (!DentistID) {
      return res.status(400).json({ errCode: 1, errMessage: "DentistID is required" });
    }
    try {
      const message = await AccountService.deleteDentist(DentistID);
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error deleting dentist:", error);
      return res.status(500).json({ errCode: 1, errMessage: "Error deleting dentist" });
    }
  }

  async handleEditDentist(req, res) {
    try {
      const data = req.body;
      if (!data.DentistID) {
        return res.status(400).json({ errCode: 2, errMessage: "DentistID is required" });
      }
      const message = await AccountService.updateDentist(data);
      if (message.errCode !== 0) {
        return res.status(400).json(message);
      }
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error updating dentist:", error);
      return res.status(500).json({ errCode: 1, errMessage: "Error updating dentist" });
    }
  }

  //****************************************** New API Get ALL Dentist (Nam )****************************** */
  async handleGetAllDentists(req, res) {
    try {
      const dentists = await authService.getAllDentists();

      if (!dentists || dentists.length === 0) {
        return res.status(404).json({ message: 'No dentists found' });
      }

      res.status(200).json({ message: 'Success', dentists });
    } catch (error) {
      console.error('Error in handleGetAllDentists:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCustomerId(req, res) {
    try {
      const { AccountID } = req.query;

      const customerInfo = await authService.getCustomerId(AccountID);
      res.json(customerInfo);
    } catch (error) {
      console.error("Error fetching1 slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }





}


export default new AccountController();
