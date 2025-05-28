import { patient } from "../../index.js";

const patientDeleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the patient by ID
    const foundPatient = await patient.findOne({ where: { id } });
    if (!foundPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Delete the patient record
    await foundPatient.destroy();

    return res
      .status(200)
      .json({ message: "Patient profile deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting patient profile", error });
  }
};
export default patientDeleteProfile;