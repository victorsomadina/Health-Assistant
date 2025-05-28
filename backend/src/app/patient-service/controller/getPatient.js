import { patient } from "../../index.js";

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the patient by ID
    const foundPatient = await patient.findOne({ where: { id } });
    if (!foundPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Return the patient data
    return res.status(200).json({
      id: foundPatient.id,
      name: foundPatient.name,
      email: foundPatient.email,
      createdAt: foundPatient.createdAt,
      updatedAt: foundPatient.updatedAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving patient data", error });
  }
};
export default getPatientById;