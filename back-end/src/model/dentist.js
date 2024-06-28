import { Model, DataTypes } from "sequelize";
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
      unique: true,
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
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
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
