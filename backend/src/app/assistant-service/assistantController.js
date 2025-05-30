import { doctor, patient, conversationRecord } from "../index.js";
import { Op } from "sequelize";
import fetch from "node-fetch";
import "dotenv/config";

const assistantController = async (req, res) => {
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;
  const question = req.body.question;
  const converse = req.body.converse;

  let response;
  const otherPartyName =
    loggedInUserRole === "patient"
      ? req.body.doctorName
      : loggedInUserRole === "doctor"
      ? req.body.patientName
      : null;

  if ((!otherPartyName && !converse) || converse === false) {
    try {
      response = await fetch(process.env.SYMTPOM_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      return res
        .status(500)
        .json({ message: "Error fetching symptoms", error });
    }
  }

  try {
    let otherParty;
    if (loggedInUserRole === "patient") {
      otherParty = await doctor.findOne({
        where: { name: otherPartyName },
        attributes: ["id", "name"],
      });
    } else if (loggedInUserRole === "doctor") {
      otherParty = await patient.findOne({
        where: { name: otherPartyName },
        attributes: ["id", "name"],
      });
    }

    if (!otherParty) {
      return res.status(404).json({
        message: `The ${
          loggedInUserRole === "patient" ? "doctor" : "patient"
        } name provided isn't found.`,
      });
    }

    const conversation = await conversationRecord.findAll({
      where: {
        [Op.or]: [
          {
            patientId:
              loggedInUserRole === "patient" ? loggedInUserId : otherParty.id,
            doctorId:
              loggedInUserRole === "doctor" ? loggedInUserId : otherParty.id,
          },
          {
            patientId:
              loggedInUserRole === "doctor" ? otherParty.id : loggedInUserId,
            doctorId:
              loggedInUserRole === "patient" ? otherParty.id : loggedInUserId,
          },
        ],
      },
    });

    if (conversation.length === 0) {
      return res.status(404).json({ message: "No transcript found" });
    }
    // retrieve conversation details
    const extractedtranscript = conversation.map((conv) => conv.conversation);
    const mainextractedtranscript = extractedtranscript.join('')

    response = await fetch(process.env.ASSISTANT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: otherParty.name,
        question: question,
        role: loggedInUserRole,
        transcript: mainextractedtranscript,
      }),
    });
    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Assistant API error:",
        response.status,
        response.statusText
      );
      return res.status(500).json({
        message: "Assistant API call failed",
        status: response.status,
        details: responseText,
      });
    }

    if (!responseText) {
      return res.status(500).json({
        message: "Empty response from Assistant API",
      });
    }

    let airesponse;
    try {
      airesponse = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse Assistant API response:", err);
      return res.status(500).json({
        message: "Assistant response is not valid JSON",
        raw: responseText,
      });
    }

    return res.status(200).json({ airesponse });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return res
      .status(500)
      .json({ message: "Error fetching transcript", error });
  }
};

export default assistantController;
