import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class DentistSchedule extends Model {}

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
    DayOfWeek: {
      type: DataTypes.ENUM,
      allowNull: false,
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    EndTime: {
      type: DataTypes.TIME,
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

export default DentistSchedule;
