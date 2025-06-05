from together import Together
from langchain.agents import Tool
from .base_agent import BaseAgent
from .prompts import DOCTOR_NOTIFICATION_PROMPT
from config import TOGETHER_API_KEY


class DoctorNotificationAgent(BaseAgent):
    def __init__(self):
        self.client = Together(api_key=TOGETHER_API_KEY)
        super().__init__(llm=None, tools=[])

    def notify_doctor(self, doctor_info, patient_info):
        user_name = patient_info.get("user_name", "A patient")
        symptoms = patient_info.get("symptoms", "unspecified symptoms")

        doctor_name_raw = doctor_info.get("name", "the doctor")
        doctor_name = f"<<DOCTOR_NAME>>{doctor_name_raw}<</DOCTOR_NAME>>"
        doctor_specialty = doctor_info.get("specialty", "a specialist")
        doctor_location = doctor_info.get("location", "an unknown clinic")

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
            temperature=0.3,
        )

        final_message = response.choices[0].message.content.strip()
        return final_message.split("\n") if "\n" in final_message else [final_message]
