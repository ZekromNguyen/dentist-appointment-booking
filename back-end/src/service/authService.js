import Sequelize from 'sequelize';
import bcrypt from "bcrypt";

import {
  Dentist,
  Customer,
  ClinicOwner,
  DentistSchedule,
  Account,
} from "../model/model";

class AccountService {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }
  async createAccountCustomer(
    username,
    hashedPassword,
    phone,
    email,
    roleID,
    verificationToken
  ) {
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
          return { error: "Username already exists" };
        }
        if (existingAccount.Email === email) {
          return { error: "Email already exists" };
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
  async createAccountDentistOrOwner(
    username,
    hashedPassword,
    phone,
    email,
    roleID
  ) {
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
          return { error: "Username already exists" };
        }
        if (existingAccount.Email === email) {
          return { error: "Email already exists" };
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
  async createCustomer(name, accountId) {
    const newCustomer = await Customer.create({
      CustomerName: name,
      AccountID: accountId,
    });
    return newCustomer;
  }
  async createDentist(dentistName, accountId, clinicID, description, imagePath) {
    try {
      console.log("Creating dentist with data:", {
        dentistName,
        accountId,
        clinicID,
        description,
        imagePath,
      });

      const newDentist = await Dentist.create({
        DentistName: dentistName,
        AccountID: accountId,
        ClinicID: clinicID,
        Description: description,
        ImagePath: imagePath,
      });

      console.log(newDentist);
      return newDentist;
    } catch (error) {
      console.error("Error inserting dentist into the database:", error);
      throw error;
    }
  }
  async createClinicOwner(clinicId, clinicOwnerName, accountId) {
    try {
      console.log("Create clinicOwner with data", {
        clinicId,
        clinicOwnerName,
        accountId,
      });
      const newClinicOwner = await ClinicOwner.create({
        ClinicID: clinicId,
        ClinicOWnerName: clinicOwnerName,
        AccountID: accountId,
      });
      if (!newClinicOwner) {
        console.log("Can not create new clinicOwner");
      }
      return newClinicOwner;
    } catch (err) {
      throw err;
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
    if (account.IsActive === false && account.verificationToken == !null) {
      return {
        error:
          "Your account is not active, please check your mail to active account",
      };
    }
    return account;
  }

  async getCustomerByAccountId(id) {
    const customer = await Customer.findOne({
      where: { AccountID: id },
    });
    if (!customer) {
      console.log(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async getDentistByAccountId(id) {
    const dentist = await Dentist.findOne({
      where: { AccountID: id },
    });
    if (!dentist) {
      console.log(`Dentist with AccountId ${id} not found`);
    }
    return dentist;
  }

  async getClinicOwnerByAccountId(id) {
    const clinicOwner = await ClinicOwner.findOne({
      where: { AccountID: id },
    });
    if (!clinicOwner) {
      console.log(`ClinicOwner with AccountId ${id} not found`);
    }
    return clinicOwner;
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
  async saveNewPassword(token, hashedpassword) {
    const account = await this.getResetToken(token);
    account.Password = hashedpassword;
    account.verificationToken = null;
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
        EndTime: etime,
      });

      return newSchedule;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }

  //////////////////////////////////////////////////////////
  //lấy tất cả người dùng
  async getAllUsers(AccountID) {
    try {
      let account = "";
      if (AccountID === "ALL") {
        account = await Account.findAll({
          raw: true,
          attributes: [
            "AccountID",
            "UserName",
            "Phone",
            "Email",
            "IsActive",
            "RoleID",
            "verificationToken",
          ],
        });
      } else if (AccountID) {
        account = await Account.findOne({
          where: { AccountID: AccountID },
          raw: true,
          attributes: [
            "AccountID",
            "UserName",
            "Phone",
            "Email",
            "IsActive",
            "RoleID",
            "verificationToken",
          ],
        });
      }

      if (!account) {
        console.log(`Account with ID ${AccountID} not found`);
      }
      return account;
    } catch (e) {
      console.error("Error in getAllUsers:", e);
      throw e;
    }
  }

  async createAccountWithoutVerification({
    username,
    hashedPassword,
    phone,
    email,
    roleID,
  }) {
    try {
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
        Password: hashedPassword, // Use hashedPassword directly
        Phone: phone,
        Email: email,
        IsActive: true, // Set account active by default
        RoleID: roleID,
      });




      return newAccount;
    } catch (error) {
      console.error("Error inserting into the database:", error);
      throw error;
    }
  }

  async hashUserPassword(password) {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      return hashedPassword;
    } catch (e) {
      console.error("Error in hashPassword:", e);
      throw e;
    }
  }

  async deleteUser(AccountID) {
    try {
      // First, delete the customer associated with the AccountID
      await Customer.destroy({ where: { AccountID } });

      // Then delete the user account
      const result = await Account.destroy({ where: { AccountID } });

      if (result) {
        return { errCode: 0, errMessage: "User deleted successfully" };
      } else {
        return { errCode: 1, errMessage: "User not found" };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user");
    }
  }

  async handleUpdateUser(data) {
    try {
      if (!data.AccountID) {
        return {
          errCode: 2,
          errMessage: "ID người dùng không được cung cấp",
        };
      }

      let user = await Account.findOne({
        where: { AccountID: data.AccountID },
      });

      if (!user) {
        return {
          errCode: 2,
          errMessage: "Người dùng không tồn tại",
        };
      }

      user.UserName = data.UserName || user.UserName;
      user.Phone = data.Phone || user.Phone;
      user.Email = data.Email || user.Email;
      user.IsActive =
        data.IsActive !== undefined ? data.IsActive : user.IsActive;
      user.RoleID = data.RoleID || user.RoleID;

      await user.save();

      return {
        errCode: 0,
        message: "Cập nhật người dùng thành công",
      };
    } catch (e) {
      console.error("Lỗi khi cập nhật người dùng:", e);
      throw e;
    }
  }




  ////////////////////////////admin ////////////////////////
  async createUser(username, hashedPassword, phone, email, roleID, additionalData = {}) {
    try {
      // Convert roleID to integer if necessary
      roleID = parseInt(roleID);

      // Check if an account with the same email or username already exists
      const existingAccount = await Account.findOne({
        where: {
          [Sequelize.Op.or]: [{ Email: email }, { UserName: username }],
        },
      });

      if (existingAccount) {
        if (existingAccount.UserName === username) {
          throw new Error('Username already exists');
        }
        if (existingAccount.Email === email) {
          throw new Error('Email already exists');
        }
      }

      // Create a new account
      const newAccount = await Account.create({
        UserName: username,
        Password: hashedPassword,
        Phone: phone,
        Email: email,
        RoleID: roleID,
        IsActive: true, // Activate if not a customer
      });

      // Insert into additional tables based on roleID
      let additionalEntity;
      switch (roleID) {
        case 1: // Customer
          if (!additionalData.CustomerName) {
            throw new Error('Customer name is required');
          }
          additionalEntity = await this.createCustomer(
            additionalData.CustomerName,
            newAccount.AccountID
          );
          break;
        case 2: // Dentist
          additionalEntity = await this.createDentist(
            additionalData.DentistName,
            newAccount.AccountID,
            additionalData.ClinicID,
            additionalData.Description
          );
          break;
        case 3: // Clinic Owner
          additionalEntity = await this.createClinicOwner(
            additionalData.ClinicID,
            additionalData.ClinicOwnerName,
            newAccount.AccountID
          );
          break;
        case 4: // Admin - Handle admin creation logic here if needed
          break;
        default:
          throw new Error('Invalid roleID');
      }

      return { newAccount, additionalEntity };
    } catch (error) {
      if (error.message === 'Invalid roleID') {
        throw new Error('Invalid roleID');
      }
      throw error; // Throw any other unexpected errors
    }
  }


  //////////////////////////////customer////////// 
  getAllCustomer = async (CustomerID) => {
    try {
      let customers;
      if (CustomerID === 'ALL') {
        customers = await Customer.findAll({
          include: [{
            model: Account,
            attributes: ['UserName', 'Phone', 'Email', 'RoleID', 'IsActive']
          }]
        });
      } else {
        customers = await Customer.findOne({
          where: { CustomerID },
          include: [{
            model: Account,
            attributes: ['UserName', 'Phone', 'Email', 'RoleID', 'IsActive']
          }]
        });
      }
      return customers;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      throw error;
    }
  };
  ///////////////////////
  async handleUpdateCustomer(data) {
    try {
      if (!data.CustomerID) {
        return {
          errCode: 2,
          errMessage: "Customer ID is not provided",
        };
      }

      let customer = await Customer.findOne({
        where: { CustomerID: data.CustomerID },
        include: [{ model: Account, as: 'Account' }] // Include Account model
      });

      if (!customer) {
        return {
          errCode: 2,
          errMessage: "Customer does not exist",
        };
      }

      // Update customer fields
      customer.CustomerName = data.CustomerName || customer.CustomerName;
      await customer.save();

      // Update Account fields if provided
      if (customer.Account) {
        customer.Account.UserName = data.UserName || customer.Account.UserName;
        customer.Account.Email = data.Email || customer.Account.Email;
        customer.Account.Phone = data.Phone || customer.Account.Phone;
        customer.Account.RoleID = data.RoleID || customer.Account.RoleID;
        customer.Account.IsActive = data.IsActive !== undefined ? data.IsActive : customer.Account.IsActive;
        await customer.Account.save();
      }

      return {
        errCode: 0,
        message: "Customer information updated successfully",
      };
    } catch (e) {
      console.error("Error updating customer information:", e);
      throw e;
    }
  }

  //**********************************New API Get ALL Dentist****************************8 */
  async getAllDentists() {
    try {
      const dentists = await Dentist.findAll({
        //    attributes: ['DentistID', 'DentistName', 'AccountID', 'ClinicID', 'Description'],
      });

      return dentists;
    } catch (error) {
      console.error("Error in getAllDentists:", error);
      throw error;
    }
  }

  //------------------------------New API Get CustomerId from AccountID----------------------------

  async getCustomerId(accountId) {
    try {
      // Thực hiện truy vấn lấy thông tin từ bảng customer và account
      const customers = await Customer.findOne({
        attributes: ["customerId", "customerName"],
        where: {},
        include: {
          model: Account,
          where: {
            AccountID: accountId,
          },
          attributes: [], // Để chỉ lấy thông tin từ bảng customer, không lấy từ bảng Account
        },
      });

      return customers;
    } catch (error) {
      console.error("Error fetching customer information:", error);
      throw new Error("Error fetching customer information");
    }
  }
}

export default new AccountService();
