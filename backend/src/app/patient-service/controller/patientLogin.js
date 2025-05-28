import { patient } from "../../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const patientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patientData = await patient.findOne({ where: { email } });
    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isMatch = await bcrypt.compare(password, patientData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: patientData.id, role: "patient" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    return res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error });
  }
};
export default patientLogin;