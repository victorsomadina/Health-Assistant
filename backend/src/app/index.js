import admin from "./admin-service/entity/adminSchema.js";
import superAdmin from "./superadmin-service/entity/superAdminSchema.js";
import conversationRecord from "./conversation-service/entity/convoSchema.js";
import {
  chatHistory,
  chatHistoryMessages,
} from "./chatHistory/Entity/chatHistorySchema.js";
import patient from "./patient-service/entity/patientSchema.js";
import doctor from "./doctor-service/entity/doctorSchema.js";

const setupAssociations = () => {
  admin.hasMany(doctor, {
    foreignKey: "hospitalId",
    as: "doctors",
  });
  doctor.belongsTo(admin, {
    foreignKey: "hospitalId",
    as: "admin",
  });
  patient.hasMany(conversationRecord, {
    foreignKey: "patientId",
    as: "conversations",
  });
  conversationRecord.belongsTo(patient, {
    foreignKey: "patientId",
    as: "patient",
  });
  doctor.hasMany(conversationRecord, {
    foreignKey: "doctorId",
    as: "conversations",
  });
  conversationRecord.belongsTo(doctor, {
    foreignKey: "doctorId",
    as: "doctor",
  });
  patient.hasMany(chatHistory, {
    foreignKey: "patientId",
    as: "chatHistories",
  });
  chatHistory.belongsTo(patient, {
    foreignKey: "patientId",
    as: "patient",
  });
  doctor.hasMany(chatHistory, {
    foreignKey: "doctorId",
    as: "chatHistories",
  });
  chatHistory.belongsTo(doctor, {
    foreignKey: "doctorId",
    as: "doctor",
  });
  chatHistory.hasMany(chatHistoryMessages, {
    foreignKey: "chatHistoryId",
    as: "messages",
  });
  chatHistoryMessages.belongsTo(chatHistory, {
    foreignKey: "chatHistoryId",
    as: "chatHistory",
  });
};

const models = [
  superAdmin,
  admin,
  doctor,
  patient,
  conversationRecord,
  chatHistory,
  chatHistoryMessages,
];

const syncSchema = async () => {
  try {
    for (const model of models) {
      await model.sync({ force: false });
    }
    setupAssociations();

    console.log("Database sync completed successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
    throw error;
  }
};

export {
  syncSchema,
  admin,
  superAdmin,
  conversationRecord,
  chatHistory,
  chatHistoryMessages,
  patient,
  doctor,
};
