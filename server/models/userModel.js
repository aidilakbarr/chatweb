import { Sequelize } from "sequelize";
import db from "../configs/database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 1024],
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
