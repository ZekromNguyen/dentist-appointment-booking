import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";
import Dentist from "./dentist";
import DentistSchedule from "./dentistSchedule";
import AvailableSlot from "./availableSlot";
import Customer from "./customer";
import ClinicOwner from "./clinicOwner";

Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });
Dentist.hasMany(DentistSchedule, { foreignKey: "DentistID" });
DentistSchedule.belongsTo(Dentist, { foreignKey: "DentistID" });
DentistSchedule.belongsTo(AvailableSlot, { foreignKey: "SlotID" });
AvailableSlot.hasMany(DentistSchedule, { foreignKey: "SlotID" });
Customer.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasMany(Customer, { foreignKey: "AccountID" });
Dentist.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasMany(Dentist, { foreignKey: "AccountID" });
ClinicOwner.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasMany(ClinicOwner, { foreignKey: "AccountID" });

export {
  sequelize,
  Account,
  Role,
  Dentist,
  DentistSchedule,
  AvailableSlot,
  Customer,
  ClinicOwner,
};
