import { doctor, admin } from "../../index.js";

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctor.findAll({
      include: [
        {
          model: admin,
          as: "admin",
          attributes: ["hospitalName"],
        },
      ],
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

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // Flatten the structure
    const flattenedDoctors = doctors.map((doc) => ({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      location: doc.location,
      DOB: doc.DOB,
      professionalDescription: doc.professionalDescription,
      field: doc.field,
      yearsOfExperience: doc.yearsOfExperience,
      hospitalName: doc.admin?.hospitalName || null, 
    }));

    return res.status(200).json({
      message: "Doctors retrieved successfully",
      doctors: flattenedDoctors,
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
