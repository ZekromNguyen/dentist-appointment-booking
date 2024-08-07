import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Account from "./account";
import ChatMessage from './messageModel';

class Customer extends Model { }
Customer.init(
  {
    CustomerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    CustomerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Account",
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

// thiết lập mối quan hệ
Account.hasOne(Customer, { foreignKey: "AccountID" });
Customer.belongsTo(Account, { foreignKey: "AccountID" });
Customer.hasMany(ChatMessage, { foreignKey: 'SenderID' }); // Adjust if needed
ChatMessage.belongsTo(Customer, { foreignKey: 'SenderID' });

export default Customer;