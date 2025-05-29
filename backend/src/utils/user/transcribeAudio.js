import fetch from "node-fetch";
import FormData from "form-data";
import "dotenv/config";

async function transcribeAudio(audioFile) {
  const formData = new FormData();

  formData.append("file", audioFile.buffer, {
    filename: audioFile.originalname,
    contentType: audioFile.mimetype,
  });

  formData.append("model", "whisper-large-v3");

  try {
    const response = await fetch(process.env.GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        contentType: "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.text) {
      throw new Error("No transcription in response");
    }
    return result.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}

export default transcribeAudio;
