import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Account extends Model {}
Account.init(
  {
    AccountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Role", // name of the Role model
        key: "RoleID",
      },
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "account",
    timestamps: false,
  }
);

export default Account;
