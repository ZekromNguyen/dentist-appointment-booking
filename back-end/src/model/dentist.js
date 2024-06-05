import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Dentist extends Model {}

Dentist.init(
  {
    DentistID: {
      type: DataTypes.INTEGER,
    },
    DentistName: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.STRING,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Account",
        key: "AccountID",
      },
    },
    ClinicID: {
      type: DataTypes.INTEGER,
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
