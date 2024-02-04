import { Sequelize } from "sequelize";
import db from "../configs/database.js";

const { DataTypes } = Sequelize;

const messageSchema = db.define(
  "Message",
  {
    chatId: DataTypes.STRING,
    senderId: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default messageSchema;
