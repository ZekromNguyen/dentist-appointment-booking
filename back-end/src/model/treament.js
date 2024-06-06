import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Treatment extends Model {}

Treatment.init(
  {
    TreatmentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    BookingDetailID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BookingDetail",
        key: "BookingDetailID",
      },
    },
    TreatmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Treatment",
    tableName: "treament",
    timestamps: false,
  }
);

export default Treatment;
