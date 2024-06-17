import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class AvailableSlot extends Model {}
AvailableSlot.init(
  {
    SlotID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    tableName: "availableslot",
    timestamps: false,
  }
);

export default AvailableSlot;
