import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Booking extends Model {}
Booking.init(
  {
    BookingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM,
      values: ["Pending", "Confirmed", "Cancelled", "Completed"],
      allowNull: false,
    },
    TotalPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customer",
        key: "CustomerID",
      },
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "booking",
    timestamps: false,
  }
);

export default Booking;
