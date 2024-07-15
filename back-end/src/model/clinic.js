import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Location from '../model/location'; // Adjust import path if necessary

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
  },
  OpenTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  CloseTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  LocationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Location', // Ensure Location is correctly referenced
      key: 'LocationID',
    },
  },
  ClinicOwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ImagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Clinic',
  tableName: 'clinic',
  timestamps: false,
});


export default Clinic;
