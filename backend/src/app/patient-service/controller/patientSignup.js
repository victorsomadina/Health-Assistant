import { patient } from "../../index.js";
import bcrypt from "bcryptjs";

const patientSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the patient already exists
    const existingPatient = await patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient record
    const newPatient = await patient.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: newPatient.id,
        name: newPatient.name,
        email: newPatient.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during signup", error });
  }
};
export default patientSignup;
