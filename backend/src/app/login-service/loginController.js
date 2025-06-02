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
          .json({
            token,
            message: "Admin login successful",
            adminData,
            role: "admin",
          });
      }
    }

    // Check if the user is a doctor
    const doctorTable = await doctor.findOne({ where: { email } });
    if (doctorTable) {
      const hospital = await admin.findOne({
        where: { id: doctorTable.hospitalId },
      });
      if (!hospital) {
        return res.status(404).json({ message: "Hospital not found" });
      }
      const hospitalName = hospital.hospitalName;
      const isMatch = await bcrypt.compare(password, doctorTable.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: doctorTable.id, role: "doctor" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const doctorData = {
          id: doctorTable.id,
          name: doctorTable.name,
          email: doctorTable.email,
          age:
            new Date().getFullYear() - new Date(doctorTable.DOB).getFullYear(),
          gender: doctorTable.gender,
          DOB: doctorTable.DOB,
          phone: doctorTable.phone,
          location: doctorTable.location,
          recordConsent: doctorTable.recordConsent,
          professionalDescription: doctorTable.professionalDescription,
          field: doctorTable.field,
          yearsOfExperience: doctorTable.yearsOfExperience,
          hospitalName: hospitalName,
          createdAt: doctorTable.createdAt,
          role: "doctor",

        };
        return res
          .status(200)
          .json({ token, message: "Doctor login successful", doctorData });
      }
    }

    // Check if the user is a patient
    const patientTable = await patient.findOne({ where: { email } });
    if (patientTable) {
      const isMatch = await bcrypt.compare(password, patientTable.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: patientTable.id, role: "patient" },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const patientData = {
          id: patientTable.id,
          name: patientTable.name,
          email: patientTable.email,
          age:
            new Date().getFullYear() - new Date(patientTable.DOB).getFullYear(),
          DOB: patientTable.DOB,
          knownAllergies: patientTable.knownAllergies,
          chronicConditions: patientTable.chronicConditions,
          createdAt: patientTable.createdAt,
          phone: patientTable.phone,
          role: "patient",
        };
        return res
          .status(200)
          .json({
            token,
            message: "Patient login successful",
            patientData,
          });
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
          .json({
            token,
            message: "Super Admin login successful",
            superAdminData,
            role: "superadmin",
          });
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
