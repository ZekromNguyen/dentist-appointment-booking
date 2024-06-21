import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Account from "./account";

class Customer extends Model {}

Customer.init(
  {
    CustomerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Thiết lập tự tăng
      allowNull: false,
    },
    CustomerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: "AccountID",
      },
    },
  },
  {
    sequelize,
    modelName: "Customer",
    tableName: "customer",
    timestamps: false,
  }
);

// Thiết lập quan hệ giữa Customer và Account
Account.hasOne(Customer, { foreignKey: "AccountID" });
Customer.belongsTo(Account, { foreignKey: "AccountID" });

export default Customer;
