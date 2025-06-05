import { doctor, patient, conversationRecord } from "../index.js";
import fetch from "node-fetch";
import "dotenv/config";

const assistantController = async (req, res) => {
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;

  // Validate user role early
  if (!["patient", "doctor"].includes(loggedInUserRole)) {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  const question = req.body.question;
  const converse = req.body.converse;

  const otherPartyName =
    loggedInUserRole === "patient" ? req.body.doctorName : req.body.patientName;

  // Case 1: No conversation — call Symptom API
  if (!otherPartyName || converse === false) {
    try {
      const response = await fetch(
        "https://wc2sdbj8-8000.uks1.devtunnels.ms/interact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      if (response.ok) {
        
      }

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Symptom API returned non-OK status:", response.status, responseText);
        return res.status(500).json({
          message: "Symptom API call failed",
          status: response.status,
          details: responseText,
        });
      }

      let airesponse;
      try {
        airesponse = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse Symptom API response:", err);
        return res.status(500).json({
          message: "Symptom API response is not valid JSON",
          raw: responseText,
        });
      }

      return res.status(200).json({ airesponse });

    } catch (error) {
      console.error("Error calling Symptom API:", error);
      return res.status(500).json({
        message: "Error fetching symptoms",
        error: error.message || error.toString(),
        stack: error.stack,
      });
    }
  };

  // Case 2: Conversation exists — fetch transcript and call Assistant API
  try {
    let otherParty;
    if (loggedInUserRole === "patient") {
      otherParty = await doctor.findOne({
        where: { name: otherPartyName },
        attributes: ["id", "name"],
      });
    } else {
      otherParty = await patient.findOne({
        where: { name: otherPartyName },
        attributes: ["id", "name"],
      });
    }

    if (!otherParty) {
      return res.status(404).json({
        message: `The ${loggedInUserRole === "patient" ? "doctor" : "patient"} name provided isn't found.`,
      });
    }

    const [patientId, doctorId] =
      loggedInUserRole === "patient"
        ? [loggedInUserId, otherParty.id]
        : [otherParty.id, loggedInUserId];

    const conversation = await conversationRecord.findAll({
      where: { patientId, doctorId },
    });

    if (conversation.length === 0) {
      return res.status(404).json({ message: "No transcript found" });
    }

    const extractedtranscript = conversation
      .map((conv) => conv.conversation)
      .join("");

    const response = await fetch('https://wc2sdbj8-5000.uks1.devtunnels.ms/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: otherParty.name,
        question,
        role: loggedInUserRole,
        transcript: extractedtranscript,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Assistant API error:", response.status, responseText);
      return res.status(500).json({
        message: "Assistant API call failed",
        status: response.status,
        details: responseText,
      });
    }

    if (!responseText) {
      return res.status(500).json({ message: "Empty response from Assistant API" });
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
    console.error("Error fetching transcript or calling Assistant API:", error);
    return res.status(500).json({
      message: "Error processing assistant conversation",
      error: error.message || error.toString(),
      stack: error.stack,
    });
  }
};

export default assistantController;
