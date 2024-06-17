import { Sequelize } from "sequelize";
import Account from "../model/account";

import AccountControl from "../controllers/authController";
import DentistSchedule from "../model/dentistSchedule";

import bcrypt from "bcrypt";
import { resolve } from "scripts";

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
        EndTime: etime
      });

      return newSchedule;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }

  // lấy tất cả người dùng
  async getAllUsers(AccountID) {
    try {
      let account = '';
      if (AccountID === 'ALL') {
        account = await Account.findAll({
          raw: true, // Trả về dữ liệu thuần túy
          attributes: ['AccountID', 'UserName', 'Phone', 'Email', 'IsActive', 'RoleID', 'verificationToken']
        });

      } else if (AccountID) {
        account = await Account.findOne({
          where: { AccountID: AccountID },
          raw: true, // Trả về dữ liệu thuần túy
          attributes: ['AccountID', 'UserName', 'Phone', 'Email', 'IsActive', 'RoleID', 'verificationToken']
        });
      }

      if (!account) {
        console.log(`Account with ID ${AccountID} not found`);
      }
      return account;
    } catch (e) {
      console.error('Error in getAllUsers:', e);
      throw e;
    }
  }


  //băm mật khẩu
  async hashUserPassword(password) {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      return hashedPassword;
    }
    catch (e) {
      console.error('Error in hashPassword:', e);
      throw e;
    }
  }

  async deleteUser(id) {
    try {
      // Kiểm tra sự tồn tại của id trước
      if (!id) {
        return {
          errCode: 2,
          errMessage: 'ID không được cung cấp'
        }
      }

      // Tìm kiếm người dùng với AccountID được cung cấp
      let user = await Account.findOne({
        where: { AccountID: id }
      });

      // Kiểm tra xem người dùng có tồn tại hay không
      if (!user) {
        return {
          errCode: 2,
          errMessage: 'Người dùng không tồn tại'
        }
      }

      // Xóa người dùng
      await user.destroy();
      return {
        errCode: 0,
        message: "Người dùng đã được xóa"
      }
    } catch (e) {
      console.error('Lỗi khi xóa người dùng:', e);
      throw e;
    }
  }

  async handleUpdateUser(data) {
    try {
      // Kiểm tra nếu data không tồn tại hoặc AccountID không tồn tại trong data
      if (!data.AccountID) {
        return {
          errCode: 2,
          errMessage: 'ID người dùng không được cung cấp'
        };
      }

      // Tìm kiếm người dùng với AccountID được cung cấp
      let user = await Account.findOne({
        where: { AccountID: data.AccountID }
      });

      // Kiểm tra xem người dùng có tồn tại hay không
      if (!user) {
        return {
          errCode: 2,
          errMessage: 'Người dùng không tồn tại'
        };
      }

      // Cập nhật thông tin người dùng
      user.UserName = data.UserName || user.UserName; // Nếu không có giá trị mới, giữ nguyên giá trị cũ
      user.Phone = data.Phone || user.Phone;
      user.Email = data.Email || user.Email;
      user.IsActive = data.IsActive !== undefined ? data.IsActive : user.IsActive; // Đảm bảo kiểm tra undefined
      user.RoleID = data.RoleID || user.RoleID;

      // Lưu các thay đổi vào cơ sở dữ liệu
      await user.save();

      return {
        errCode: 0,
        message: 'Cập nhật người dùng thành công'
      };
    } catch (e) {
      console.error('Lỗi khi cập nhật người dùng:', e);
      throw e;
    }
  }




}

export default new AccountService();
