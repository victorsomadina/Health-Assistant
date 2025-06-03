import { doctor, patient, conversationRecord } from "../../index.js";

const getConversedDoctors = async (req, res) => {
  const patientId = req.body.patientId;

  try {
    // Fetch all conversation records for the patient, including doctor details
    const convoRecord = await conversationRecord.findAll({
      where: { patientId },
      include: [
        {
          model: doctor,
          as: "doctor",
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
        },
      ],
    });

    if (!convoRecord || convoRecord.length === 0) {
      return res
        .status(404)
        .json({ message: "No conversations found for this patient" });
    }

    // Use a Set to store unique doctor names
    const doctorNamesSet = new Set();

    convoRecord.forEach((record) => {
      if (record.doctor && record.doctor.name) {
        doctorNamesSet.add(record.doctor.name);
      }
    });

    // Convert Set to array
    const uniqueDoctorNames = Array.from(doctorNamesSet);

    return res.status(200).json({
      message: "Conversed doctors retrieved successfully",
      doctors: uniqueDoctorNames, // array of doctor names (strings)
    });
  } catch (error) {
    console.error("Error retrieving conversed doctors:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving conversed doctors", error });
  }
};

export default getConversedDoctors;
