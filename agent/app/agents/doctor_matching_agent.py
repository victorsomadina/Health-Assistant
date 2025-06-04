import json
import logging
from langchain_together import Together
from services.tools import get_doctors_by_hospital_and_symptoms, _get_all_hospitals_raw
from config import TOGETHER_API_KEY

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class DoctorMatchingAgent:
    """
    Simplified Doctor Matching Agent that avoids LangChain ReAct agent issues
    by using direct LLM calls with structured prompts.
    """
    
    def __init__(self):
        self.llm = Together(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            temperature=0,
            together_api_key=TOGETHER_API_KEY,
            max_tokens=500  # Fix the warning about max_tokens
        )
    
    def match_doctors(self, symptoms, hospital=None):
        """
        Main method to find doctors based on symptoms and optional hospital.
        
        Args:
            symptoms (str): Patient's symptoms description
            hospital (str or dict, optional): Hospital name or hospital dict
        
        Returns:
            dict: Contains llm_response, doctors list, hospital_info, and symptoms
        """
        try:
            if hospital:
                # Direct search for doctors at specific hospital
                hospital_name = self._get_hospital_name(hospital)
                return self._search_doctors_at_hospital(symptoms, hospital_name, hospital)
            else:
                # First show hospitals, then search for doctors
                return self._search_hospitals_and_doctors(symptoms)
                
        except Exception as e:
            logging.error(f"Error in match_doctors: {e}")
            return {
                "llm_response": "Sorry, I encountered an error while searching for doctors. Please try again.",
                "doctors": [],
                "hospital_info": {"name": "", "id": ""},
                "symptoms": symptoms,
                "error": str(e)
            }
    
    def _search_doctors_at_hospital(self, symptoms, hospital_name, hospital_obj):
        """Search for doctors at a specific hospital"""
        try:
            logging.info(f"Searching for doctors at {hospital_name} for symptoms: {symptoms}")
            
            # Call the API to get doctors
            input_data = json.dumps({"hospital": hospital_name, "symptoms": symptoms})
            doctors_json = get_doctors_by_hospital_and_symptoms(input_data)
            doctors = json.loads(doctors_json)
            
            # Handle API errors
            if isinstance(doctors, dict) and "error" in doctors:
                return {
                    "llm_response": f"Sorry, I couldn't find doctors at {hospital_name}. {doctors['error']}",
                    "doctors": [],
                    "hospital_info": {"name": hospital_name, "id": ""},
                    "symptoms": symptoms
                }
            
            # Ensure doctors is a list
            if not isinstance(doctors, list):
                doctors = []
            
            # Generate response using LLM
            llm_response = self._generate_doctor_response(symptoms, hospital_name, doctors)
            
            return {
                "llm_response": llm_response,
                "doctors": doctors,
                "hospital_info": {
                    "name": hospital_name,
                    "id": hospital_obj.get("id", "") if isinstance(hospital_obj, dict) else ""
                },
                "symptoms": symptoms
            }
            
        except Exception as e:
            logging.error(f"Error searching doctors at hospital: {e}")
            return {
                "llm_response": f"I encountered an error while searching for doctors at {hospital_name}.",
                "doctors": [],
                "hospital_info": {"name": hospital_name, "id": ""},
                "symptoms": symptoms
            }
    
    def _search_hospitals_and_doctors(self, symptoms):
        """Search for hospitals first, then doctors"""
        try:
            # Get all hospitals
            hospitals_json = _get_all_hospitals_raw()
            hospitals = json.loads(hospitals_json)
            
            if not hospitals:
                return {
                    "llm_response": "Sorry, no hospitals are available at the moment.",
                    "doctors": [],
                    "hospital_info": {"name": "", "id": ""},
                    "symptoms": symptoms
                }
            
            # Try to find doctors at the first available hospital as an example
            first_hospital = hospitals[0]
            hospital_name = first_hospital.get("hospitalName", "")
            
            input_data = json.dumps({"hospital": hospital_name, "symptoms": symptoms})
            doctors_json = get_doctors_by_hospital_and_symptoms(input_data)
            doctors = json.loads(doctors_json)
            
            if not isinstance(doctors, list):
                doctors = []
            
            # Generate response with hospitals and doctors info
            llm_response = self._generate_hospitals_and_doctors_response(symptoms, hospitals, doctors, hospital_name)
            
            return {
                "llm_response": llm_response,
                "doctors": doctors,
                "hospital_info": {
                    "name": hospital_name,
                    "id": first_hospital.get("id", "")
                },
                "symptoms": symptoms
            }
            
        except Exception as e:
            logging.error(f"Error searching hospitals and doctors: {e}")
            return {
                "llm_response": "I encountered an error while searching for hospitals and doctors.",
                "doctors": [],
                "hospital_info": {"name": "", "id": ""},
                "symptoms": symptoms
            }
    
    def _generate_doctor_response(self, symptoms, hospital_name, doctors):
        """Generate a natural language response about found doctors"""
        try:
            if not doctors:
                prompt = f"""
You are a helpful medical assistant. A patient has symptoms: "{symptoms}" and wants to find doctors at {hospital_name}.
Unfortunately, no doctors were found at this hospital for these symptoms.

Generate a polite, helpful response that:
1. Acknowledges their symptoms
2. Explains that no doctors were found at this specific hospital
3. Suggests they might try contacting the hospital directly or consider other hospitals
4. Remains supportive and professional

Keep the response concise and empathetic.
"""
            else:
                doctors_info = []
                for doctor in doctors:
                    name = doctor.get("name", "Unknown Doctor")
                    specialty = doctor.get("specialty", doctor.get("field", "General Medicine"))
                    doctors_info.append(f"- {name} ({specialty})")
                
                doctors_list = "\n".join(doctors_info)
                
                prompt = f"""
You are a helpful medical assistant. A patient has symptoms: "{symptoms}" and is looking for doctors at {hospital_name}.

Here are the available doctors found:
{doctors_list}

Generate a helpful, professional response that:
1. Acknowledges their symptoms
2. Confirms the hospital they're interested in
3. Lists the available doctors with their specialties
4. Provides encouragement about getting proper medical care
5. Keeps a warm, supportive tone

Keep the response concise but informative.
"""
            
            response = self.llm.invoke(prompt)
            return response.content if hasattr(response, 'content') else str(response)
            
        except Exception as e:
            logging.error(f"Error generating doctor response: {e}")
            if doctors:
                return f"I found {len(doctors)} doctor(s) at {hospital_name} for your symptoms: {symptoms}"
            else:
                return f"No doctors were found at {hospital_name} for your symptoms: {symptoms}"
    
    def _generate_hospitals_and_doctors_response(self, symptoms, hospitals, doctors, example_hospital):
        """Generate response showing hospitals and example doctors"""
        try:
            hospitals_list = []
            for hospital in hospitals[:5]:  # Show first 5 hospitals
                name = hospital.get("hospitalName", "Unknown Hospital")
                location = hospital.get("location", "Location not specified")
                hospitals_list.append(f"- {name} (Location: {location})")
            
            hospitals_text = "\n".join(hospitals_list)
            
            doctors_info = ""
            if doctors:
                doctors_info = f"\nAs an example, at {example_hospital}, I found:\n"
                for doctor in doctors[:3]:  # Show first 3 doctors
                    name = doctor.get("name", "Unknown Doctor")
                    specialty = doctor.get("specialty", doctor.get("field", "General Medicine"))
                    doctors_info += f"- {name} ({specialty})\n"
            
            prompt = f"""
You are a helpful medical assistant. A patient has symptoms: "{symptoms}" and needs to find appropriate medical care.

Here are the available hospitals:
{hospitals_text}
{doctors_info}

Generate a helpful response that:
1. Acknowledges their symptoms
2. Shows them the available hospitals
3. If doctors were found, mention the example doctors found
4. Guides them on next steps (choosing a hospital)
5. Maintains a supportive, professional tone

Keep the response organized and easy to follow.
"""
            
            response = self.llm.invoke(prompt)
            return response.content if hasattr(response, 'content') else str(response)
            
        except Exception as e:
            logging.error(f"Error generating hospitals response: {e}")
            return f"I found {len(hospitals)} hospitals available for your symptoms: {symptoms}. Please choose a hospital to see available doctors."
    
    def get_hospitals(self):
        """Get all available hospitals"""
        try:
            hospitals_json = _get_all_hospitals_raw()
            logging.debug(f"Raw hospitals JSON: {hospitals_json}")
            return json.loads(hospitals_json)
        except Exception as e:
            logging.error(f"Error getting hospitals: {e}")
            return []
    
    def _get_hospital_name(self, hospital):
        """Extract hospital name from various input formats"""
        if isinstance(hospital, dict):
            return hospital.get("hospitalName", hospital.get("name", ""))
        return str(hospital)
    
    # Keep these methods for backward compatibility with CoordinatorAgent
    def _extract_doctors_from_result(self, result):
        """Extract doctors from result - for compatibility"""
        return result.get("doctors", [])
    
    def _extract_hospital_info(self, result, initial_hospital_input):
        """Extract hospital info - for compatibility"""
        if initial_hospital_input:
            return {
                "name": self._get_hospital_name(initial_hospital_input),
                "id": initial_hospital_input.get("id", "") if isinstance(initial_hospital_input, dict) else ""
            }
        return result.get("hospital_info", {"name": "", "id": ""})