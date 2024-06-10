import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class DentistSchedule extends Model { }
DentistSchedule.init({
    ScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    DentistID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Dentist",
            key: "DentistID"
        }
    },
    DayOfWeek: {
        type: DataTypes.ENUM,
        values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        allowNull: false,
    },
    StartTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    EndTime: {
        type: DataTypes.TIME,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "DentistSchedule",
    tableName: "DentistSchedule",
    timestamps: false,
});

export default DentistSchedule;