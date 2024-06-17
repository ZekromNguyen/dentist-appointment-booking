import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";
import Dentist from "./dentist";
import DentistSchedule from "./dentistSchedule";
import DentistSchedule1 from "./dentistSchedule1";
import AvailableSlot from "./availableSlot";

Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });
Dentist.hasMany(DentistSchedule, { foreignKey: "DentistID" });
DentistSchedule.belongsTo(Dentist, { foreignKey: "DentistID" });
DentistSchedule1.belongsTo(AvailableSlot, { foreignKey: "SlotID" });
AvailableSlot.hasMany(DentistSchedule1, { foreignKey: "SlotID" });
export {
  sequelize,
  Account,
  Role,
  Dentist,
  DentistSchedule,
  DentistSchedule1,
  AvailableSlot,
};
