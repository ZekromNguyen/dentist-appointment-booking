// models/DentistSchedule.js
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class DentistSchedule extends Model { }

DentistSchedule.init(
  {
    ScheduleID: {
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
    Status: {
      type: DataTypes.ENUM("Available", "Booked", "Cancelled", "Expired"),
      defaultValue: "Available",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DentistSchedule",
    tableName: "dentistschedule",
    timestamps: false,
  }
);

DentistSchedule.associate = function (models) {
  DentistSchedule.belongsTo(models.Dentist, { foreignKey: 'DentistID', as: 'Dentist' });
  DentistSchedule.belongsTo(models.AvailableSlot, { foreignKey: 'SlotID', as: 'AvailableSlot' });
};

export default DentistSchedule;
