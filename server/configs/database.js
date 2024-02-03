import { Sequelize } from "sequelize";

const db = new Sequelize("chatweb", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
