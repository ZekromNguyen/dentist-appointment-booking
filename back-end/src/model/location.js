import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Location extends Model {}

Location.init(
  {
    LocationID: {
      type: DataTypes.INTEGER,
    },
    LocationName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Location",
    tableName: "location",
    timestamps: false,
  }
);

export default Location;
