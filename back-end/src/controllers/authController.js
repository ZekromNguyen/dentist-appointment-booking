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
      req.session.userId = account.AccountID;
      return res.redirect("/showAccount");
    } catch (err) {
      console.error("Error excuting query:", err.stack);
      res.status(500).send("Database query error");
    }
  }
  async showHomeAccount(req, res) {
    const id = req.session.userId;

    if (!id) {
      //return res.status(400).send("Account ID is required");
      return res.redirect("/login");
    }

    try {
      const account1 = await AccountService.getAccount(id);
      const customer1 = await AccountService.getCustomer(id);

      if (!account1) {
        return res.status(404).send("Account not found");
      }

      return res.render("homeAccount", {
        account: account1,
        customer: customer1,
      });
    } catch (err) {
      console.error("Error fetching account details:", err.stack);
      return res.status(500).send("Internal server error");
    }
  }
  async registerCustomer(req, res) {
    const { username, password, email, phone, roleID, name } = req.body;
    console.log("Request body:", req.body);
    try {
      if (!username || !password || !email || !phone || !name) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const newAccount = await AccountService.createAccount({
        username,
        hashedPassword,
        phone,
        email,
        roleID,
        verificationToken,
      });
      const newCustomer = await AccountService.createCustomer({
        name,
        accountId: newAccount.AccountID,
      });
      if (newAccount.verificationToken && newCustomer) {
        const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
        const mailOptions = {
          from: process.env.EMAIL_APP_GMAIL,
          to: email,
          subject: "Email Verification",
          text: `Please verify your email by clicking the following link: ${verificationLink}`,
          html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(500).send(error.toString());
          }
          res.status(200).send("A verification email has been sent to:", email);
        });
      }
      console.log("Account create:", newAccount);
      if (newAccount) {
        res.redirect("/login");
      }
    } catch (err) {
      if (err.message === "Email already exists") {
        return res.render("register", {
          error: "Email already taken",
          username: username,
          email: email,
          phone: phone,
          name: name,
        });
      }
      if (err.message === "Username already exists") {
        return res.render("register", {
          error: "Username already taken",
          username: username,
          email: email,
          phone: phone,
          name: name,
        });
      }
      res.status(500).send("Database insert error");
    }
  }
  async registerDentist(req, res) {
    const { username, password, email, phone, roleID, dentistName, clinicID } =
      req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newAccount = await AccountService.createAccountDentist({
        username,
        hashedPassword,
        phone,
        email,
        roleID,
      });
      const newDentist = await AccountService.createDentist({
        dentistName,
        accountId: newAccount.AccountID,
        clinicID,
      });
      if (newDentist) {
        return res.redirect("/login");
      } else {
        throw new Error("Dentist creation failed");
      }
    } catch (err) {
      if (err.message === "Email already exists") {
        return res.render("register", {
          error: "Email already taken",
          username: username,
          email: email,
          phone: phone,
          dentistName: dentistName,
        });
      }
      if (err.message === "Username already exists") {
        return res.render("register", {
          error: "Username already taken",
          username: username,
          email: email,
          phone: phone,
          dentistName: dentistName,
        });
      }
      res.status(500).send("Database insert error");
    }
  }

  // async register(req, res) {
  //   const { username, password, email, phone, name } = req.body;
  //   const roleID = 1;
  //   const hashedPassword = bcrypt.hashSync(password, 10);
  //   const verificationToken = crypto.randomBytes(32).toString("hex");
  //   const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
  //   try {
  //     if (!username || !password || !email || !phone || !name) {
  //       return res.status(400).json({ message: "All fields are required" });
  //     }

  //     console.log("Hashed password:", hashedPassword);
  //     const mailOptions = {
  //       from: process.env.EMAIL_APP_GMAIL,
  //       to: email,
  //       subject: "Email Verification",
  //       text: `Please verify your email by clicking the following link: ${verificationLink}`,
  //       html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  //     };
  //     console.log("Request body:", req.body);
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         res.status(500).send(error.toString());
  //       }
  //       res.status(200).send("A verification email has been sent to:", email);
  //     });
  //     const newAccount = await AccountService.createAccount({
  //       username,
  //       hashedPassword,
  //       phone,
  //       email,
  //       roleID,
  //       verificationToken,
  //       name,
  //     });
  //     console.log("Account create:", newAccount);
  //     if (newAccount) {
  //       res.redirect("/login");
  //     }
  //   } catch (err) {
  //     //console.error("Error inserting into the database:", err.stack);
  //     if (err.message === "Email already exists") {
  //       return res.render("register", {
  //         error: "Email already taken",
  //         username: username,
  //         email: email,
  //         phone: phone,
  //         name: name,
  //       });
  //     }
  //     if (err.message === "Username already exists") {
  //       return res.render("register", {
  //         error: "Username already taken",
  //         username: username,
  //         email: email,
  //         phone: phone,
  //         name: name,
  //       });
  //     }
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
      name: "",
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
}

export default new AccountController();
