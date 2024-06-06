import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class BookingDetail extends Model {}

BookingDetail.init(
  {
    BookingDetailID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    DateBook: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TypeBook: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM,
      allowNull: false,
    },
    SlotID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AvailableSlot",
        key: "SlotID",
      },
    },
    DentistID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Dentist",
        key: "DentistID",
      },
    },
    ClinicID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clinic",
        key: "ClinicID",
      },
    },
    PriceBooking: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    MedicalDay: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    BookingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Booking",
        key: "BookingID",
      },
    },
  },
  {
    sequelize,
    modelName: "BookingDetail",
    tableName: "bookingdetail",
    timestamps: false,
  }
);

export default BookingDetail;
