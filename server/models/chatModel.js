import { Sequelize } from "sequelize";
import db from "../configs/database.js";

const { DataTypes } = Sequelize;

const ChatSchema = db.define(
  "Chat",
  {
    members: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ChatSchema;
