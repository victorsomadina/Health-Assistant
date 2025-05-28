import { doctor } from "../../index.js";

const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await doctor.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "location",
        "DOB",
        "professionalDescription",
        "field",
        "yearsOfExperience",
      ],
    });

    // Check if any doctors were found
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // Return the list of doctors
    return res.status(200).json({
      message: "Doctors retrieved successfully",
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving doctors", error });
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the doctor by ID
    const foundDoctor = await doctor.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "email",
        "location",
        "DOB",
        "professionalDescription",
        "field",
        "yearsOfExperience",
      ],
    });

    // Check if the doctor was found
    if (!foundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return the doctor's details
    return res.status(200).json({
      message: "Doctor retrieved successfully",
      doctor: foundDoctor,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving doctor", error });
  }
};

export { getAllDoctors, getDoctorById };
