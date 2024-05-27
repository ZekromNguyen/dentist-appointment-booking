import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Role extends Model {}
Role.init(
  {
    RoleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    RoleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "Role",
    timestamps: false,
  }
);

export default Role;
