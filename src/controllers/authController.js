import AccountService from "../service/authService";

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
      if (account) {
        res.redirect("/");
      } else {
        res.status(401).send("Invalid Username Or Password");
      }
    } catch (err) {
      console.error("Error excuting query:", err.stack);
      res.status(500).send("Database query error");
    }
  }
  async register(req, res) {
    const { username, password, email, phone } = req.body;
    const roleID = 1;
    try {
      if (!username || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }
      console.log("Request body:", req.body);
      const newAccount = await AccountService.createAccount({
        username,
        password,
        phone,
        email,
        roleID,
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
    res.render("login");
  }
  async showRegister(req, res) {
    res.render("register", {
      error: null,
      username: "",
      email: "",
    });
  }
}

module.exports = new AccountController();
