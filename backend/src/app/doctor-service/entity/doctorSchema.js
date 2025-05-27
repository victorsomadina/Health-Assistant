import { DataTypes } from "sequelize";
import db from "../../../database/databaseConnection.js";

const doctor = db.define("doctor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true,
  },
  hospitalId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
        model: 'admin',
        key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DOB: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  recordConsent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  professionalDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  field: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {tableName: 'doctor'});

export default doctor;
