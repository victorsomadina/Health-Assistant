import { patient } from "../../index.js";

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the patient by ID
    const foundPatient = await patient.findOne({ where: { id } });
    if (!foundPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const getAge = (dob) => {
      if (!dob) return null;
      const birthDate = new Date(dob);
      const ageDiff = new Date().getFullYear() - birthDate.getFullYear();
      return ageDiff;
    };

    // Return the patient data
    return res.status(200).json({
      id: foundPatient.id,
      name: foundPatient.name,
      email: foundPatient.email,
      age: getAge(foundPatient.DOB),
      DOB: foundPatient.DOB,
      phone: foundPatient.phone,
      location: foundPatient.location,
      gender: foundPatient.gender,
      knownAllergies: foundPatient.knownAllergies,
      chronicConditions: foundPatient.chronicConditions,
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
