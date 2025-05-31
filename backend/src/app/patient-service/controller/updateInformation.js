import {patient} from "../../index.js";
import "dotenv/config";

const patientUpdateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    location,
    gender,
    date_of_birth,
    phone,
    known_allergies,
    chronic_conditions
  } = req.body;

  try {
    const foundPatient = await patient.findOne({ where: { id } });
    if (!foundPatient) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Update the doctor's profile with the provided data
    foundPatient.location = location || foundPatient.location;
    foundPatient.DOB = date_of_birth || foundPatient.DOB;
    foundPatient.gender = gender || foundPatient.gender;
    foundPatient.phone = phone || foundPatient.phone;
    foundPatient.knownAllergies = known_allergies || foundPatient.knownAllergies;
    foundPatient.chronicConditions = chronic_conditions || foundPatient.chronicConditions;
    await foundPatient.save();

    // calculate age from date_of_birth
    const dob = new Date(foundPatient.DOB);
    const age = new Date().getFullYear() - dob.getFullYear();

    return res.status(200).json({
      message: "Patient Profile Updated Successfully",
      doctor: {
        id: foundPatient.id,
        name: foundPatient.name,
        gender: foundPatient.gender,
        email: foundPatient.email,
        location: foundPatient.location,
        age: age,
        known_allergies: foundPatient.knownAllergies,
        chronic_conditions: foundPatient.chronicConditions,
        phone: foundPatient.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error });
  }
};
export default patientUpdateProfile;
