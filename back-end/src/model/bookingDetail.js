import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class BookingDetail extends Model { }
BookingDetail.init(
  {
    BookingDetailID: {
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
    ScheduleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DentistSchedule",
        key: "ScheduleID",
      },
    },
  },
  {
    sequelize,
    modelName: "BookingDetail",
    tableName: "bookingdetail",
    timestamps: false,
  }
);

export default BookingDetail;
