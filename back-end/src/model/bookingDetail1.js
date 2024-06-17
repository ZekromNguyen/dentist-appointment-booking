import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class BookingDetail1 extends Model {}
BookingDetail1.init(
  {
    BookingDetailID1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DateBook: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TypeBook: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM,
      values: ["Pending", "Confirmed", "Cancelled", "Completed"],
      allowNull: false,
    },
    PriceBooking: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    MedicalDay: {
      type: DataTypes.DATEONLY,
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
    ScheduleID1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DentistSchedule1",
        key: "ScheduleID1",
      },
    },
  },
  {
    sequelize,
    modelName: "BookingDetail1",
    tableName: "bookingdetail1",
    timestamps: false,
  }
);

export default BookingDetail1;
