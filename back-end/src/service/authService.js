import { Sequelize } from "sequelize";
import Account from "../model/account";

class AccountService {
  async createAccount({ username, password, phone, email, roleID }) {
    try {
      console.log("Creating account with data:", {
        username,
        password,
        phone,
        email,
        roleID,
      });
      const existingAccount = await Account.findOne({
        where: {
          [Sequelize.Op.or]: [{ Email: email }, { UserName: username }],
        },
      });
      if (existingAccount) {
        if (existingAccount.UserName === username) {
          throw new Error("Username already exists");
        }
        if (existingAccount.Email === email) {
          throw new Error("Email already exists");
        }
      }
      const newAccount = await Account.create({
        UserName: username,
        Password: password,
        Phone: phone,
        Email: email,
        IsActive: false,
        RoleID: roleID,
      });
      return newAccount;
    } catch (error) {
      console.error("Error inserting into the database:", error);
      throw error;
    }
  }
  async getAccountByUserNameOrEmail(usernameOrEmail) {
    return await Account.findOne({
      where: {
        [Sequelize.Op.or]: [
          {
            UserName: usernameOrEmail,
          },
          {
            Email: usernameOrEmail,
          },
        ],
      },
    });
  }
  async authenticate(usernameOrEmail, password) {
    const account = await this.getAccountByUserNameOrEmail(usernameOrEmail);
    if (account && account.Password === password) {
      return account;
    }
    return null;
  }
}

module.exports = new AccountService();
