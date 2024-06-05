import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Booking extends Model {}

Booking.init(
  {
    BookingID: {
      type: DataTypes.INTEGER,
    },
    Status: {
      type: DataTypes.ENUM,
    },
    TotalPrice: {
      type: DataTypes.DECIMAL,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
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
