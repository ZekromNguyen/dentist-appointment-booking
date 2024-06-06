import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Dentist extends Model {}

Dentist.init(
  {
    DentistID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DentistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Account",
        key: "AccountID",
      },
    },
    ClinicID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clinic",
        key: "ClinicID",
      },
    },
  },
  {
    sequelize,
    modelName: "Dentist",
    tableName: "dentist",
    timestamps: false,
  }
);

export default Dentist;
