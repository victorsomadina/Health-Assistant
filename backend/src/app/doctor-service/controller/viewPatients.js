import { conversationRecord, patient } from "../../index.js";

const viewPatients = async (req, res) => {
  const id = req.user.id;
  try {
    await conversationRecord
      .findAll({
        where: { doctorId: id },
        attributes: ["doctorId", "patientId"],
        include: [
          {
            model: patient,
            as: "patient",
            attributes: [
              "id",
              "name",
              "email",
              "location",
              "DOB",
              "knownAllergies",
              "chronicConditions",
            ],
          },
        ],
      })
      .then((patients) => {
        if (patients.length === 0) {
          return res.status(404).json({ message: "No patients found" });
        }
        return res.status(200).json({
          message: "Patients retrieved successfully",
          patients,
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving patients",
      error,
    });
  }
};
export default viewPatients;
