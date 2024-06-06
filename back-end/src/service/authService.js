import { Sequelize } from "sequelize";
import Account from "../model/account";
import Customer from "../model/customer";
import bcrypt from "bcrypt";
import Dentist from "../model/dentist";
class AccountService {
  async createAccount({
    username,
    hashedPassword,
    phone,
    email,
    roleID,
    verificationToken,
  }) {
    try {
      console.log("Creating account with data:", {
        username,
        hashedPassword,
        phone,
        email,
        roleID,
        verificationToken,
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
        Password: hashedPassword,
        Phone: phone,
        Email: email,
        IsActive: false,
        RoleID: roleID,
        verificationToken: verificationToken,
      });
      return newAccount;
    } catch (error) {
      console.error("Error inserting into the database:", error);
      throw error;
    }
  }
  async createAccountDentist({
    username,
    hashedPassword,
    phone,
    email,
    roleID,
  }) {
    try {
      console.log("Creating account with data:", {
        username,
        hashedPassword,
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
        Password: hashedPassword,
        Phone: phone,
        Email: email,
        IsActive: true,
        RoleID: roleID,
      });
      return newAccount;
    } catch (error) {
      console.error("Error inserting into the database:", error);
      throw error;
    }
  }
  async getAccountByUserNameOrEmail(usernameOrEmail) {
    const account = await Account.findOne({
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
    if (!account) {
      console.log(
        `Account with username or email ${usernameOrEmail} not found`
      );
    }
    return account;
  }

  async authenticate(usernameOrEmail, password) {
    const account = await this.getAccountByUserNameOrEmail(usernameOrEmail);
    //console.log("hasedpassword database:", account.Password);
    if (!account) {
      return { error: "Account is not found" };
    }
    if (!bcrypt.compareSync(password, account.Password)) {
      return { error: "Incorrect password" };
    }
    if (!account.IsActive === true) {
      return { error: "Account is not active" };
    }
    // if (
    //   account &&
    //   bcrypt.compareSync(password, account.Password) &&
    //   account.IsActive === true
    // ) {
    //   return account;
    // }
    // return null;
    return account;
  }
  async getTokenVerify(token) {
    const account = await Account.findOne({
      where: { verificationToken: token },
    });
    if (!account) {
      console.log(`Account with verifyToken ${token} not found`);
    }
    account.IsActive = true;
    account.verificationToken = null;
    await account.save();
    return account;
  }
  async createCustomer({ name, accountId }) {
    const newCustomer = await Customer.create({
      CustomerName: name,
      AccountID: accountId,
    });
    return newCustomer;
  }
  async createDentist({ dentistName, accountId, clinicID }) {
    try {
      console.log("Creating dentist with data:", {
        dentistName,
        accountId,
        clinicID,
      });

      const newDentist = await Dentist.create({
        DentistName: dentistName,
        AccountID: accountId,
        ClinicID: clinicID,
      });

      console.log(newDentist);
      return newDentist;
    } catch (error) {
      console.error("Error inserting dentist into the database:", error);
      throw error;
    }
  }
  async getCustomer(id) {
    const getCustomer = await Customer.findOne({ where: { AccountID: id } });
    if (!getCustomer) {
      console.log(`Customer with AccountID ${id} not found`);
    }
    return getCustomer;
  }
  async getAccount(id) {
    const getAccount = await Account.findOne({ where: { AccountID: id } });
    if (!getAccount) {
      console.log(`Account with AccountID ${id} not found`);
    }
    return getAccount;
  }
}

module.exports = new AccountService();
