import { conversationRecord, doctor } from "../../index.js";
import transcribeAudio from "../../../utils/user/transcribeAudio.js";

const audiotranscribe = async (req, res) => {
  const id = req.params.id;
  const { doctorName } = req.body;
  const audioFile = req.file;

  if (!audioFile) {
    return res.status(400).json({ message: "No audio file provided" });
  }
  try {
    const transcription = await transcribeAudio(audioFile);
    console.log("Transcription:", transcription);
    const doctorTable = await doctor.findOne({
      where: { name: doctorName },
      attributes: ["id", "name"],
    });

    const newConversation = await conversationRecord.create({
      patientId: id,
      doctorId: doctorTable.id,
      conversation: transcription,
    });

    return res.status(201).json({
      message: "Audio transcribed successfully",
      conversation: {
        id: newConversation.id,
        patientId: newConversation.patientId,
        doctorId: newConversation.doctorId,
        transcription: newConversation.transcription,
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
