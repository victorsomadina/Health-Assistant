import { doctor, admin } from "../../index.js";
import "dotenv/config";

const doctorUpdateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    location,
    gender,
    date_of_birth,
    record_consent,
    professional_description,
    field,
    years_of_experience,
    phone,
  } = req.body;

  try {
    const foundDoctor = await doctor.findOne({ where: { id } });
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Update the doctor's profile with the provided data
    foundDoctor.location = location || foundDoctor.location;
    foundDoctor.DOB = date_of_birth || foundDoctor.DOB;
    foundDoctor.recordConsent = record_consent || foundDoctor.recordConsent;
    foundDoctor.professionalDescription =
      professional_description || foundDoctor.professionalDescription;
    foundDoctor.field = field || foundDoctor.field;
    foundDoctor.yearsOfExperience =
      years_of_experience || foundDoctor.yearsOfExperience;
    foundDoctor.phone = phone || foundDoctor.phone;
    foundDoctor.gender = gender || foundDoctor.gender;
    await foundDoctor.save();

    // calculate age from date_of_birth
    const getAge = (dob) => {
      if (!dob) return null;
      const birthDate = new Date(dob);
      const ageDiff = new Date().getFullYear() - birthDate.getFullYear();
      return ageDiff;
    };
    const age = getAge(foundDoctor.DOB);

    // get hospital name from admin table
    const hospital = await admin.findOne({
      where: { id: foundDoctor.hospitalId },
    });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: {
        id: foundDoctor.id,
        name: foundDoctor.name,
        email: foundDoctor.email,
        age: age,
        gender: foundDoctor.gender,
        phone: foundDoctor.phone,
        location: foundDoctor.location,
        recordConsent: foundDoctor.recordConsent,
        professional_description: foundDoctor.professionalDescription,
        field: foundDoctor.field,
        years_of_experience: foundDoctor.yearsOfExperience,
        hospitalName: hospital.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error });
  }
};
export default doctorUpdateProfile;
