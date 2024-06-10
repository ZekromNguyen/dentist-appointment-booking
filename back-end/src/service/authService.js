import { Sequelize } from "sequelize";
import Account from "../model/account";
import DentistSchedule from "../model/dentistSchedule";

import bcrypt from "bcrypt";

class AccountService {
  async createAccountCustomer({
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
  async createAccountDentistOrOwner({
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
    if (account.roleID === 1 && !account.IsActive === true) {
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
  async getAccountById(id) {
    const account = await Account.findOne({
      where: { AccountID: id },
    });

    if (!account) {
      console.log(`Account with ID ${id} not found`);
    }
    return account;
  }
  async createResetToken(email, token) {
    const account = await this.getAccountByUserNameOrEmail(email);
    if (!account) {
      console.log("Not found account in service");
    }
    account.verificationToken = token;
    await account.save();
    return account;
  }
  async getResetToken(token) {
    const account = await Account.findOne({
      where: { verificationToken: token },
    });
    if (!account) {
      console.log(`Not found token ${token}`);
    }
    return account;
  }
  async saveNewPassword(id, hashedpassword) {
    const account = await this.getAccountById(id);
    account.Password = hashedpassword;
    await account.save();
    return account;
  }
  async resetNewPassword() { }

  async createSchedule({ DentistID, day, stime, etime }) {
    try {
      const newSchedule = await DentistSchedule.create({
        DentistID,
        DayOfWeek: day,
        StartTime: stime,
        EndTime: etime
      });

      return newSchedule;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }
}

export default new AccountService();
