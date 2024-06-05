import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Clinic extends Model {}

Clinic.init(
  {
    ClinicID: {
      type: DataTypes.INTEGER,
    },
    ClinicName: {
      type: DataTypes.STRING,
    },
    Address: {
      type: DataTypes.STRING,
    },
    OpenTime: {
      type: DataTypes.TIME,
    },
    CloseTime: {
      type: DataTypes.TIME,
    },
    LocationID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Location",
        key: "LocationID",
      },
    },
  },
  {
    sequelize,
    modelName: "Clinic",
    tableName: "clinic",
    timestamps: false,
  }
);

export default Clinic;
