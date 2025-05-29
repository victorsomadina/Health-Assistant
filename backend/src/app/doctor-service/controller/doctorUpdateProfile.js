import {doctor} from "../../index.js";
import "dotenv/config";

const doctorUpdateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    location,
    DOB,
    recordConsent,
    professionalDescription,
    field,
    yearsOfExperience,
  } = req.body;

  try {
    const foundDoctor = await doctor.findOne({ where: { id } });
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Update the doctor's profile with the provided data
    foundDoctor.location = location || foundDoctor.location;
    foundDoctor.DOB = DOB || foundDoctor.DOB;
    foundDoctor.recordConsent = recordConsent || foundDoctor.recordConsent;
    foundDoctor.professionalDescription =
    professionalDescription || foundDoctor.professionalDescription;
    foundDoctor.field = field || foundDoctor.field;
    foundDoctor.yearsOfExperience =
    yearsOfExperience || foundDoctor.yearsOfExperience;
    await foundDoctor.save();
    return res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: {
        id: foundDoctor.id,
        name: foundDoctor.name,
        email: foundDoctor.email,
        location: foundDoctor.location,
        DOB: foundDoctor.DOB,
        recordConsent: foundDoctor.recordConsent,
        professionalDescription: foundDoctor.professionalDescription,
        field: foundDoctor.field,
        yearsOfExperience: foundDoctor.yearsOfExperience,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error });
  }
};
export default doctorUpdateProfile;
