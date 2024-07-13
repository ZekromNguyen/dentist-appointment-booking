import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";
import Dentist from "./dentist";
import DentistSchedule from "./dentistSchedule";
import AvailableSlot from "./availableSlot";
import Customer from "./customer";
import ClinicOwner from "./clinicOwner";
import Booking from "./booking";
import BookingDetail from "./bookingDetail";
import Clinic from "./clinic";
import Treatment from "./treatment";

Clinic.belongsTo(ClinicOwner, {foreignKey:"ClinicOwnerID"});
ClinicOwner.hasMany(Clinic, {foreignKey:"ClinicOwnerID"});


Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });

Dentist.hasMany(DentistSchedule, { foreignKey: "DentistID" });
DentistSchedule.belongsTo(Dentist, { foreignKey: "DentistID" });

DentistSchedule.belongsTo(AvailableSlot, { foreignKey: "SlotID" });
AvailableSlot.hasMany(DentistSchedule, { foreignKey: "SlotID" });

Customer.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasOne(Customer, { foreignKey: "AccountID" });

Dentist.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasOne(Dentist, { foreignKey: "AccountID" });

ClinicOwner.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasOne(ClinicOwner, { foreignKey: "AccountID" });

Booking.belongsTo(Customer, { foreignKey: "CustomerID" });
Customer.hasMany(Booking, { foreignKey: "CustomerID" });

BookingDetail.belongsTo(DentistSchedule, { foreignKey: "ScheduleID" });
DentistSchedule.hasOne(BookingDetail, { foreignKey: "ScheduleID" });

BookingDetail.belongsTo(Booking, { foreignKey: "BookingID" });
Booking.hasMany(BookingDetail, { foreignKey: "BookingID" });

Treatment.belongsTo(BookingDetail, {foreignKey:"BookingDetailID"});
BookingDetail.hasOne(Treatment, {foreignKey: "BookingDetailID"});

export {
  sequelize,
  Account,
  Role,
  Dentist,
  DentistSchedule,
  AvailableSlot,
  Customer,
  ClinicOwner,
  Clinic,
  Booking,
  BookingDetail,
  Treatment,
};
