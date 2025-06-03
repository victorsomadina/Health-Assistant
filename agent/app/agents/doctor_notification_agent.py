from together import Together
from langchain.agents import Tool
from langchain.prompts import PromptTemplate
from .base_agent import BaseAgent
from services.tools import generate_whatsapp_link
from .prompts import DOCTOR_NOTIFICATION_PROMPT
from config import TOGETHER_API_KEY
import urllib.parse

class DoctorNotificationAgent(BaseAgent):
    def __init__(self):
        self.client = Together(api_key=TOGETHER_API_KEY)

        tools = [
            Tool(
                name="GenerateWhatsAppLink",
                func=generate_whatsapp_link,
                description="Generate WhatsApp contact link for doctor"
            )
        ]
        super().__init__(llm=None, tools=tools)

        def notify_doctor(self, doctor_info, patient_info):
            user_name = patient_info.get("user_name", "A patient")
            symptoms = patient_info.get("symptoms", "unspecified symptoms")

            doctor_name = doctor_info.get("name", "the doctor")
            doctor_specialty = doctor_info.get("specialty", "a specialist")
            doctor_location = doctor_info.get("location", "an unknown clinic")
            doctor_phone = doctor_info.get("contact", None)

            filled_prompt = DOCTOR_NOTIFICATION_PROMPT.format(
                user_name=user_name,
                doctor_name=doctor_name,
                doctor_specialty=doctor_specialty,
                doctor_location=doctor_location,
                symptom_summary=symptoms
            )

            response = self.client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                messages=[{"role": "user", "content": filled_prompt}],
                temperature=0,
            )

            final_message = response.choices[0].message.content.strip()

            whatsapp_link = None
            if doctor_phone:
                whatsapp_link = generate_whatsapp_link(doctor_phone, final_message)

            return {
                "sent": "WhatsApp link generated.",
                "message": final_message,
                "whatsapp_link": whatsapp_link
            }

