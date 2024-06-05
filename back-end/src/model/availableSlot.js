import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class AvailableSlot extends Model {}
AvailableSlot.init(
  {
    SlotID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AvailableSlot",
    tableName: "availableSlot",
    timestamps: false,
  }
);
export default AvailableSlot;
