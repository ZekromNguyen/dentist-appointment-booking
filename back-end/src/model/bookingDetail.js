import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class BookingDetail extends Model {}

BookingDetail.init(
  {
    BookingIDDetail: {
      type: DataTypes.INTEGER,
    },
    DateBook: {
      type: DataTypes.DATE,
    },
    TypeBook: {
      type: DataTypes.STRING,
    },
    Status: {
      type: DataTypes.ENUM,
    },
    SlotID: {
      type: DataTypes.INTEGER,
      references: {
        model: "AvailableSlot",
        key: "SlotID",
      },
    },
    DentistID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Dentist",
        key: "DentistID",
      },
    },
    ClinicID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Clinic",
        key: "ClinicID",
      },
    },
    PriceBooking: {
      type: DataTypes.DECIMAL,
    },
    MedicalDay: {
      type: DataTypes.DATE,
    },
    BookingID: {
      type: DataTypes.INTEGER,
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
