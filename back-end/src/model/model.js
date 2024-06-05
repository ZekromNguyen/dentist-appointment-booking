import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";
import Customer from "./customer";

Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });
Customer.belongsTo(Account, { foreignKey: "AccountID" });
Account.hasMany(Customer, { foreignKey: "AccountID" });
export { sequelize, Account, Role, Customer };
