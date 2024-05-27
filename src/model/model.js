import sequelize from "../config/database";
import Account from "../model/account";
import Role from "../model/role";

Account.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(Account, { foreignKey: "RoleID" });

export { sequelize, Account, Role };
