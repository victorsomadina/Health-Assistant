import { DataTypes } from "sequelize";
import db from "../../../database/databaseConnection.js";

const conversationRecord = db.define("admin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: "doctor",
      key: "id",
    },
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "patient",
      key: "id",
    },
  },
  conversation: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},{tableName: "conversationRecord"});

export default conversationRecord;
