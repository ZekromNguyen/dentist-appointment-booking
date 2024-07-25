import AccountService from "../service/authService";
import transporter from "../config/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import upload from "../config/multer";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendReactivateEmail,
} from "../config/email";

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
      if (
        !account.IsActive &&
        account.roleID === 1 &&
        account.verificationToken === null
      ) {
        // Generate reset token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await AccountService.createResetToken(account.Email, verificationToken);
        const verificationLink = `http://localhost:5173/ResetPassword?token=${verificationToken}`;

        // Send reset password email
        const emailResult = await sendReactivateEmail(
          account.Email,
          verificationLink
        );
        if (!emailResult.success) {
          throw new Error("Failed to send reset password email");
        }

        return res
          .status(200)
          .send(
            `Your account is inactive. A reset password email has been sent to: ${account.Email}`
          );
      }
      let userData = {};
      switch (account.RoleID) {
        case 1:
          const customer = await AccountService.getCustomerByAccountId(account.AccountID);
          userData = {
            user: customer.CustomerName,
            id: account.AccountID,
            customerId: customer.CustomerID,
            RoleID: account.RoleID,
            IsActive: account.IsActive,
          };
          break;
        case 2:
          const dentist = await AccountService.getDentistByAccountId(account.AccountID);
          userData = {
            user: dentist.DentistName,
            id: account.AccountID,
            dentistId: dentist.DentistID,
            RoleID: account.RoleID,
            IsActive: account.IsActive,
          };
          break;
        case 3:
          const clinicOwner = await AccountService.getClinicOwnerByAccountId(account.AccountID);
          userData = {
            user: clinicOwner.ClinicOwnerName,
            id: account.AccountID,
            clinicOwnerId: clinicOwner.ClinicOwnerID,
            RoleID: account.RoleID,
            IsActive: account.IsActive,
          };
          break;
        case 4:
          userData = {
            user: account.UserName,
            id: account.AccountID,
            RoleID: account.RoleID,
            IsActive: account.IsActive,
          };
          break;
        default:
          return res.status(500).json({ message: "Unknown role ID" });
      }

      // Store user data in session
      req.session.user = userData;
      req.session.authorized = true;
      // Respond with success message and session user data
      res.status(200).json({ message: "Login successfully", user: userData });
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
  getSessionMiddleware = (req, res, next) => {
    if (req.session && req.session.authorized) {
      next(); // Cho phép điều hướng đến hàm xử lý chính
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  async getSession(req, res) {
    if (req.session.authorized) {
      // if (req.session.user) {
      res.status(200).json(req.session.user);
    } else {
      res.status(401).json({ message: "No session found" });
    }
  }
  async registerCustomer(req, res) {
    const { username, password, email, phone, name } = req.body;
    const roleID = 1;

    try {
      if (!username || !password || !email || !phone || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const newAccount = await AccountService.createAccountCustomer(username, hashedPassword, phone, email, roleID, verificationToken);
      if (newAccount.error) {
        return res.status(400).json({ error: newAccount.error });
      }

      const newCustomer = await AccountService.createCustomer(name, newAccount.AccountID);

      if (newAccount.verificationToken && newCustomer) {
        const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink);
        return res.status(200).json({ message: "A verification email has been sent to: " + email });
      } else {
        return res.status(500).json({ message: "Failed to create customer" });
      }
    } catch (err) {
      console.error("Error in registering customer:", err);
      return res.status(500).send("Lỗi hệ thống");
    }
  }
  async verifyAccount(req, res) {
    const { token } = req.query;

    try {
      const account = await AccountService.getTokenVerify(token);
      if (!account) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Kích hoạt tài khoản của người dùng hoặc thực hiện hành động khác
      await AccountService.activateAccount(account.AccountID);

      // Chuyển hướng đến trang đăng nhập hoặc trang chính
      res.redirect('http://localhost:5173/login');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }


  registerDentist = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).json({ message: "Failed to upload image" });
      }

      const {
        username,
        password,
        email,
        phone,
        dentistName,
        clinicID,
        description,
      } = req.body;

      if (
        !username ||
        !password ||
        !email ||
        !phone ||
        !dentistName ||
        !clinicID ||
        !description
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Set roleID for dentists (hardcoded to 2)
        const roleID = 2;

        // Create the account
        const newAccount = await AccountService.createAccountDentistOrOwner(
          username,
          hashedPassword,
          phone,
          email,
          roleID
        );

        if (newAccount.error) {
          return res.status(400).json({ error: newAccount.error });
        }

        // Get image path from uploaded file
        const imagePath = req.file ? `uploads/${req.file.filename}` : null;

        // Create dentist information with the image path and description
        const newDentist = await AccountService.createDentist(
          dentistName,
          newAccount.AccountID,
          clinicID,
          description,
          imagePath
        );

        console.log("Account created:", newAccount);
        console.log("Dentist created:", newDentist);

        return res
          .status(200)
          .json({ message: "Dentist registered successfully" });
      } catch (err) {
        console.error("Error creating dentist account:", err);
        res.status(500).send("Database insert error");
      }
    });
  };

  // async registerDentist(req, res) {
  //   const { username, password, email, phone, roleID, dentistName, clinicID } =
  //     req.body;
  //   try {
  //     if (!username || !password || !email || !phone || !dentistName) {
  //       return res.status(400).json({ message: "All fields are required" });
  //     }
  //     const hashedPassword = bcrypt.hashSync(password, 10);
  //     const newAccount = await AccountService.createAccountDentistOrOwner(
  //       username,
  //       hashedPassword,
  //       phone,
  //       email,
  //       roleID
  //     );
  //     if (newAccount.error) {
  //       return res.status(400).json({ error: newAccount.error });
  //     }
  //     const newDentist = await AccountService.createDentist(
  //       dentistName,
  //       newAccount.AccountID,
  //       clinicID
  //     );
  //     console.log("Account create:", newAccount);
  //     console.log("Customer create:", newDentist);
  //     return res
  //       .status(200)
  //       .json({ message: "Account dentist create successfully" });
  //   } catch (err) {
  //     res.status(500).send("Database insert error");
  //   }
  // }
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
    try {
      const { email } = req.body;
      console.log(email);
      const newAccount = await AccountService.getAccountByUserNameOrEmail(email);
      if (!newAccount) {
        return res
          .status(400)
          .json({ message: `Not found account with email ${email}` });
      }
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const account = await AccountService.createResetToken(
        email,
        verificationToken
      );
      if (!account) {
        console.log("Not found account in controller");
      }
      const verificationLink = `http://localhost:5173/ResetPassword?token=${verificationToken}`;
      await sendResetPasswordEmail(email, verificationLink);
      res.status(200).send(`A reset password email has been sent to: ${email}`);
    } catch (error) {
      res
        .status(500)
        .send("Error sending reset password email: " + error.toString());
    }
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
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const updatedAccount = await AccountService.saveNewPassword(
        token,
        hashedPassword
      );

      if (!updatedAccount) {
        return res
          .status(400)
          .json({ message: `No account found with token ${token}` });
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

  // get all clinic
  async getAllClinic(req, res) {
    try {
      const { ownerId } = req.query;
      const clinics = await AccountService.getAllClinic(ownerId);
      if (!clinics || clinics.length === 0) {
        res.status(404).json({ message: "Success, Not found clinc" });
      }
      res.status(200).json({ message: "Success", clinics });
    } catch (error) {
      res.status(500).json({ message: "Error fetching all clinic" });
      console.error("Error fetching all clinic", error);
    }
  }

  ///////////////////////////////user//////////////////////
  ///// Lấy hết account
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

  //////// Xoá tài khoản user
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

  ////////////////Update tài khoản user
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
  //////////////////////////////////////////////////////////

  //////////////customer////////////////////////////////////////
  async handleGetAllCustomer(req, res) {
    let CustomerID = req.query.CustomerID; // All, id
    if (!CustomerID) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        account: [],
      });
    }
    try {
      let account = await AccountService.getAllCustomer(CustomerID);
      return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        account,
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
      return res.status(500).json({
        errCode: 2,
        errMessage: "Server error",
        account: [],
      });
    }
  }

  ///////update customer
  async handleUpdateCustomer(req, res) {
    try {
      let data = req.body;

      // Call service to update customer information
      let message = await AccountService.handleUpdateCustomer(data);

      // Check service response
      if (message.errCode !== undefined && message.errCode !== 0) {
        // Return error if there's an issue from the service
        return res.status(400).json(message);
      }

      // Return success if no errors
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error in handleUpdateCustomer:", error);
      // Return error if there's an exception during processing
      return res.status(500).json({
        errCode: 1,
        errMessage: "An error occurred, please try again later",
      });
    }
  }

  //////////////////////////admin///////////////////////////////////////////////
  async handleCreateUser(req, res) {
    const { username, password, email, phone, roleID, name, dentistName, description, clinicID, clinicOwnerName } = req.body;
    const saltRounds = 10; // Number of salt rounds for bcrypt hashing

    try {
      // Validate required fields
      if (!username || !password || !email || !phone || !roleID) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Prepare additional data based on role
      const additionalData = {};
      switch (roleID) {
        case "1": // Customer
          if (!name) {
            return res.status(400).json({ message: "CustomerName is required" });
          }
          additionalData.CustomerName = name;
          break;
        case "2": // Dentist
          if (!dentistName || !clinicID || !description) {
            return res.status(400).json({ message: "All fields for Dentist are required" });
          }
          additionalData.DentistName = dentistName;
          additionalData.ClinicID = clinicID;
          additionalData.Description = description;
          break;
        case "3": // ClinicOwner
          if (!clinicOwnerName) {
            return res.status(400).json({ message: "All fields for ClinicOwner are required" });
          }
          // additionalData.ClinicID = clinicID;
          additionalData.ClinicOwnerName = clinicOwnerName;
          break;
        default:
          return res.status(400).json({ message: "Invalid role ID" });
      }

      // Call AuthService method to create the account
      const result = await AccountService.createUser(username, hashedPassword, phone, email, roleID, additionalData);

      // Handle the response based on the result
      if (result && result.newAccount) {
        return res.status(200).json({ message: "Account created successfully", newAccount: result.newAccount });
      } else {
        return res.status(400).json({ message: "Failed to create account" });
      }
    } catch (err) {
      console.error('Error in handleCreateUser:', err);
      // Handle specific errors if needed
      if (err.message === "Email already exists") {
        return res.status(400).json({ error: "Email already taken" });
      }
      if (err.message === "Username already exists") {
        return res.status(400).json({ error: "Username already taken" });
      }
      if (err.message === "CustomerName is required" || err.message === "All fields for Dentist are required" || err.message === "All fields for ClinicOwner are required") {
        return res.status(400).json({ error: err.message });
      }
      // Handle generic error
      return res.status(500).json({ message: "Database insert error" });
    }
  }


  /////////////////////////////////////////////////////////////////////////
  //****************************************** New API Get ALL Dentist (Nam )****************************** */
  async handleGetAllDentists(req, res) {
    try {
      const dentists = await AccountService.getAllDentists();

      if (!dentists || dentists.length === 0) {
        return res.status(404).json({ message: "No dentists found" });
      }

      res.status(200).json({ message: "Success", dentists });
    } catch (error) {
      console.error("Error in handleGetAllDentists:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCustomerId(req, res) {
    try {
      const { AccountID } = req.query;

      const customerInfo = await AccountService.getCustomerId(AccountID);
      res.json(customerInfo);
    } catch (error) {
      console.error("Error fetching1 slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new AccountController();
