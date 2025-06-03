import { conversationRecord, doctor } from "../../index.js";
import transcribeAudio from "../../../utils/user/transcribeAudio.js";

const audiotranscribe = async (req, res) => {
  const id = req.params.id;
  const notes = req.body.notes? req.body.notes : null;
  const { doctorName,
    purpose
   } = req.body;
  const audioFile = req.file;

  if (!audioFile) {
    return res.status(400).json({ message: "No audio file provided" });
  }
  try {
    const transcription = await transcribeAudio(audioFile);
    const doctorTable = await doctor.findOne({
      where: { name: doctorName },
      attributes: ["id", "name"],
    });
    if (!doctorTable) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
    const newConversation = await conversationRecord.create({
      patientId: id,
      doctorId: doctorTable.id,
      conversation: transcription,
      purpose: purpose,
      notes: notes,
    });

    return res.status(201).json({
      message: "Audio transcribed successfully",
      conversation: {
        id: newConversation.id,
        patientId: newConversation.patientId,
        doctorName: doctorName,
        purpose: newConversation.purpose,   
        notes: newConversation.notes,      
        createdAt: newConversation.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during transcription:", error);
    return res
      .status(500)
      .json({ message: "Error during transcription", error });
  }
};

export default audiotranscribe;
