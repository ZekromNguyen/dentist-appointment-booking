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
      type: DataTypes.ENUM("Available", "Booked", "Cancelled"),
      defaultValue: "Available", // Giá trị mặc định khi tạo mới
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
  DentistSchedule.hasMany(models.AvailableSlot, { foreignKey: 'ScheduleID', as: 'AvailableSlot' });
};

export default DentistSchedule;
