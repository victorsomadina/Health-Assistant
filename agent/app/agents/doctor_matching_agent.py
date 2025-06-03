from services.tools import get_doctors_by_hospital_and_symptoms, get_all_hospitals
from together import Together
from langchain.agents import Tool
from langchain.prompts import PromptTemplate
from .base_agent import BaseAgent
from .prompts import DOCTOR_MATCHING_PROMPT
from config import TOGETHER_API_KEY
import json
import re
import requests

class DoctorMatchingAgent(BaseAgent):
    def __init__(self):
        self.client = Together(api_key=TOGETHER_API_KEY)

        tools = [
            Tool(
                name="DoctorDatabase",
                func=get_doctors_by_hospital_and_symptoms,
                description="Find doctors using hospital and symptoms"
            )
        ]
        super().__init__(llm=None, tools=tools)

        self.prompt_template = PromptTemplate(
            input_variables=["symptoms", "hospital"],
            template=DOCTOR_MATCHING_PROMPT
        )

    def get_hospitals(self):
        """Fetch hospitals directly from API"""
        try:
            from config import HOSPITAL_DB_API_URL
            response = requests.get(HOSPITAL_DB_API_URL)
            if response.status_code == 200:
                data = response.json()
                hospitals = data.get("hospitals", [])
                print(f"Fetched hospitals: {hospitals}")
                return hospitals
            else:
                print(f"Hospital API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error getting hospitals: {e}")
            return []

    def match_doctors(self, symptoms, hospital):
        hospital_name = hospital
        if isinstance(hospital, dict):
            hospital_name = hospital.get("hospitalName", "")
        
        print(f"Matching doctors for hospital: {hospital_name}, symptoms: {symptoms}")
    
        prompt = self.prompt_template.format(symptoms=symptoms, hospital=hospital_name)

        response = self.client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )

        message = response.choices[0].message.content.strip()


        input_payload = json.dumps({
            "hospital": hospital_name,  
            "symptoms": symptoms
        })
        
        matched = get_doctors_by_hospital_and_symptoms.func(input_payload)  
        print(f"Raw matched response: {matched}")

        try:
            doctors = json.loads(matched)
            print(f"Parsed doctors: {doctors}")
        except Exception as e:
            print(f"Error parsing doctors: {e}")
            doctors = []

        return {
            "llm_response": message,
            "doctors": doctors
        }