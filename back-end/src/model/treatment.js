// Treatment.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Treatment extends Model { }
Treatment.init({
    TreatmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    BookingDetailID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Note: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Result: {
        type: DataTypes.STRING,
        allowNull: true, // Store URL of the image
    }
}, {
    sequelize,
    modelName: 'Treatment',
    tableName: 'Treatment',
    timestamps: false,
});

export default Treatment;
