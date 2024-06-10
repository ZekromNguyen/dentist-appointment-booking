import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";
import Dentist from "./dentist";
import DentistSchedule from "./dentistSchedule";


Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });
Dentist.hasMany(DentistSchedule, { foreignKey: "DentistID" });
DentistSchedule.belongsTo(Dentist, { foreignKey: "DentistID" });
export { sequelize, Account, Role, Dentist, DentistSchedule }
