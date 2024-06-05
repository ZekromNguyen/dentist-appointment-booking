import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class DentistSchedule extends Model {}

DentistSchedule.init(
  {
    ScheduleID: {
      type: DataTypes.INTEGER,
    },
    DentistID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Dentist",
        key: "DentistID",
      },
    },
    DayOfWeek: {
      type: DataTypes.ENUM,
    },
    StartTime: {
      type: DataTypes.TIME,
    },
    EndTime: {
      type: DataTypes.TIME,
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
