import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Clinic extends Model { }
Clinic.init({
    ClinicID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    ClinicName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },

    OpenTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },

    CloseTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },

    LocationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Role", // name of the Role model
            key: "RoleID",
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