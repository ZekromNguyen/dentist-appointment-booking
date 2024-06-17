import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class DentistSchedule1 extends Model {}
DentistSchedule1.init(
  {
    ScheduleID1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DentistID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Dentist",
        key: "DentistID",
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
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    DayOfWeek: {
      type: DataTypes.ENUM,
      values: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
  {
    sequelize,
    modelName: "DentistSchedule1",
    tableName: "DentistSchedule1",
    timestamps: false,
  }
);

export default DentistSchedule1;
