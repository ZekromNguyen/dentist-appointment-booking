import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ClinicOwner extends Model {}

ClinicOwner.init(
  {
    ClinicOwnerID: {
      type: DataTypes.INTEGER,
    },
    ClinicID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Clinic",
        key: "ClinicID",
      },
    },
    ClinicOWnerName: {
      type: DataTypes.STRING,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Account",
        key: "AccountID",
      },
    },
  },
  {
    sequelize,
    modelName: "ClinicOwner",
    tableName: "clinicowner",
    timestamps: false,
  }
);

export default ClinicOwner;
