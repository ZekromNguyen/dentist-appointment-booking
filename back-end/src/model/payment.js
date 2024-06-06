import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Payment extends Model {}

Payment.init(
  {
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    BookingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Booking",
        key: "BookingID",
      },
    },
    PaymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payment",
    timestamps: false,
  }
);

export default Payment;
