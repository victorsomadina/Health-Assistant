import { admin, doctor, patient, superAdmin } from "../index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is an admin
    const adminData = await admin.findOne({ where: { email } });
    if (adminData) {
      const isMatch = await bcrypt.compare(password, adminData.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: adminData.id, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        return res
          .status(200)
          .json({ token, message: "Admin login successful", adminData, role: "admin" });
      }
    }

    // Check if the user is a doctor
    const doctorData = await doctor.findOne({ where: { email } });
    if (doctorData) {
      const isMatch = await bcrypt.compare(password, doctorData.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: doctorData.id, role: "doctor" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        return res
          .status(200)
          .json({ token, message: "Doctor login successful", doctorData, role: "doctor" });
      }
    }

    // Check if the user is a patient
    const patientData = await patient.findOne({ where: { email } });
    if (patientData) {
      const isMatch = await bcrypt.compare(password, patientData.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: patientData.id, role: "patient" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        return res
          .status(200)
          .json({ token, message: "Patient login successful", patientData, role: "patient" });
      }
    }

    // Check if the user is a super admin
    const superAdminData = await superAdmin.findOne({ where: { email } });
    if (superAdminData) {
      const isMatch = await bcrypt.compare(password, superAdminData.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: superAdminData.id, role: "superadmin" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        return res
          .status(200)
          .json({ token, message: "Super Admin login successful", superAdminData, role: "superadmin" });
      }
    }

    // If no match found
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export default loginController;
