import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class DentistScheduleBooking extends Model {}

DentistScheduleBooking.init(
  {
    ScheduleBookingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ShiftID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DentistShift",
        key: "ShiftID",
      },
    },
    BookingDetailID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BookingDetail",
        key: "BookingDetailID",
      },
    },
    SlotID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AvailableSlot",
        key: "SlotID",
      },
    },
  },
  {
    sequelize,
    modelName: "DentistScheduleBooking",
    tableName: "dentistschedulebooking",
    timestamps: false,
  }
);

export default DentistScheduleBooking;
