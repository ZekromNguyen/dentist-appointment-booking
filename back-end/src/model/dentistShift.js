import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class DentistShift extends Model {}

DentistShift.init(
  {
    ShiftID: {
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
    ShiftDate: {
      type: DataTypes.DATEONLY,
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
    modelName: "DentistShift",
    tableName: "dentistshift",
    timestamps: false,
  }
);

export default DentistShift;
