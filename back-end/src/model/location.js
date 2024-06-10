import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Location extends Model { }
Location.init({
    LocationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    LocationName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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