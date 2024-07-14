import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Account from "./account";

class ClinicOwner extends Model { }

ClinicOwner.init(
  {
    ClinicOwnerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ClinicID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clinic",
        key: "ClinicID",
      },
    },
    ClinicOwnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

ClinicOwner.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasOne(ClinicOwner, { foreignKey: "AccountID" });

export default ClinicOwner;
