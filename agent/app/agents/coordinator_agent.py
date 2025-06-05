import json
import logging
from .first_aid_agent import FirstAidAgent
from .doctor_matching_agent import DoctorMatchingAgent
from .doctor_notification_agent import DoctorNotificationAgent
from together import Together
from app.config import TOGETHER_API_KEY

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class CoordinatorAgent:
    def __init__(self):
        self.first_aid_agent = FirstAidAgent()
        self.doctor_matching_agent = DoctorMatchingAgent()
        self.doctor_notification_agent = DoctorNotificationAgent()
        self.client = Together(api_key=TOGETHER_API_KEY)

        self.pending_symptoms = {}
        self.first_aid_complete = {}
        self.awaiting_doctor_selection = {}
        self.awaiting_hospital_selection = {}
        self.available_hospitals = {}
        self.session_histories = {}
        self.first_aid_turn_count = {}

    def handle_conversation(self, user_input, session_id="default", history=None):
        user_input_clean = user_input.strip().lower()

        self._initialize_session(session_id)
        history = self.session_histories[session_id]
        history.append({"role": "user", "content": user_input})
        logging.debug(f"Session ID: {session_id}, User Input: {user_input}")

        if self.awaiting_hospital_selection.get(session_id, False):
            return self._handle_hospital_selection(user_input, session_id)

        if self.awaiting_doctor_selection.get(session_id, False):
            return self._handle_doctor_selection(user_input, session_id)

        # Use reasoning model to determine if user wants doctor consultation
        reasoning = self._reasoning_model(user_input, session_id)
        if reasoning.get("status") == "done":
            symptoms = reasoning.get("symptoms", user_input)
            self.pending_symptoms[session_id] = symptoms
            self.first_aid_complete[session_id] = True
            return self._handle_hospital_selection_flow(session_id)

        # Continue with first aid
        return self._handle_first_aid(user_input, session_id)



    def _initialize_session(self, session_id):
        self.first_aid_complete.setdefault(session_id, False)
        self.pending_symptoms.setdefault(session_id, None)
        self.session_histories.setdefault(session_id, [])
        self.awaiting_doctor_selection.setdefault(session_id, False)
        self.awaiting_hospital_selection.setdefault(session_id, False)
        self.available_hospitals.setdefault(session_id, [])
        self.first_aid_turn_count.setdefault(session_id, 0)

    def _handle_first_aid(self, user_input, session_id):
        history = self.session_histories[session_id]
        self.first_aid_turn_count[session_id] += 1
        try:
            response_data = self.first_aid_agent.handle_user_input(user_input, history=history)
            logging.debug(f"First aid response: {response_data}")

            advice = response_data.get("advice", "")
            symptoms = response_data.get("symptoms", user_input)
            done = response_data.get("done", False)

            self.pending_symptoms[session_id] = symptoms
            self.first_aid_complete[session_id] = done

            message = advice
            if done:
                message += "\n\nWould you like me to help you find a doctor if you feel you need further attention?"

            history.append({"role": "assistant", "content": message})
            return message

        except Exception as e:
            logging.error(f"Error in first aid handling: {e}")
            return "I apologize, but I encountered an error while processing your request. Please try again."

    def _reasoning_model(self, user_input, session_id):
        history = self.session_histories.get(session_id, [])
        context_summary = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-5:]])

        prompt = f"""
You are an intelligent medical conversation analyzer. Your job is to analyze the entire conversation between a user and a first-aid assistant to determine when the user is ready to be connected to a doctor.

Analyze the conversation flow and determine if the user now wants or needs to consult with a doctor. Look for:

1. **Explicit requests for doctor consultation:**
   - "I want to see a doctor"
   - "Can you find me a doctor?"
   - "I need medical attention"
   - "Connect me to a doctor"

2. **Acceptance of doctor referral:**
   - User says "yes", "okay", "sure" when asked if they want to find a doctor
   - User agrees to seek professional medical help

3. **Escalation indicators:**
   - User indicates first aid advice isn't sufficient
   - Symptoms are worsening despite first aid
   - User expresses concern about severity
   - User asks for professional medical opinion

4. **Natural conversation conclusion:**
   - First aid guidance has been provided
   - User seems ready for next step in care
   - Conversation naturally leads to professional consultation

DO NOT mark as "done" if:
- User is just describing initial symptoms
- User is still actively receiving and responding to first aid guidance
- User is asking follow-up questions about the first aid advice
- No indication of wanting professional medical consultation

Recent conversation:
{context_summary}

Latest user input: {user_input}

Respond in **only** this JSON format:
{{
"status": "done",
"symptoms": "brief description of user's main symptoms"
}}
OR
{{
"status": "not_done",
"symptoms": ""
}}
"""

        try:
            response = self.client.chat.completions.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )
            reply = response.choices[0].message.content.strip()
            logging.debug(f"[Reasoning Model Reply] {reply}")

            # Clean up the response
            reply_clean = reply.replace('```json', '').replace('```', '').strip()
            
            if '{' in reply_clean and '}' in reply_clean:
                start_idx = reply_clean.find('{')
                end_idx = reply_clean.rfind('}') + 1
                json_str = reply_clean[start_idx:end_idx]
                return json.loads(json_str)

            return {"status": "not_done", "symptoms": ""}

        except Exception as e:
            logging.error(f"[Reasoning Model Error]: {e}")
            return {"status": "not_done", "symptoms": ""}

    def _handle_hospital_selection_flow(self, session_id):
        try:
            # This calls the corrected get_hospitals method in DoctorMatchingAgent
            hospitals = self.doctor_matching_agent.get_hospitals() 
            logging.debug(f"Available hospitals: {hospitals}")

            if not hospitals:
                return "Unfortunately, no hospitals are available right now. Please try contacting your local healthcare provider directly."

            if not isinstance(hospitals, list):
                logging.error(f"Unexpected hospitals data structure: {type(hospitals)}")
                return "I encountered an issue accessing hospital information. Please try again later."

            self.available_hospitals[session_id] = hospitals

            if len(hospitals) == 1:
                hospital = hospitals[0]
                hospital_name = self._safe_get(hospital, 'hospitalName', 'Unknown Hospital')
                logging.debug(f"Only one hospital available: {hospital_name}")
                return self._handle_doctor_matching(session_id, hospital)

            self.awaiting_hospital_selection[session_id] = True

            hospitals_list = []
            for i, hospital in enumerate(hospitals, 1):
                name = self._safe_get(hospital, 'hospitalName', f'Hospital {i}')
                location = self._safe_get(hospital, 'location', 'Location not specified')
                hospitals_list.append(f"{i}. {name} - {location}")

            response = "I found multiple hospitals available. Please choose one:\n\n"
            response += "\n".join(hospitals_list)
            response += "\n\nPlease reply with the hospital number or name (e.g., '1' or 'Get Well Hospital')."

            self.session_histories[session_id].append({"role": "assistant", "content": response})
            return response

        except Exception as e:
            logging.error(f"Error in hospital selection flow: {e}")
            return "I encountered an error while accessing hospital information. Please try again later or contact your healthcare provider directly."

    def _handle_hospital_selection(self, user_input, session_id):
        """Handle user's hospital selection"""
        hospitals = self.available_hospitals.get(session_id, [])
        user_input_clean = user_input.strip().lower()

        try:
            # Try to parse as number
            hospital_number = int(user_input_clean)
            if 1 <= hospital_number <= len(hospitals):
                selected_hospital = hospitals[hospital_number - 1]
            else:
                selected_hospital = None
        except ValueError:
            # Try to match by name
            selected_hospital = next(
                (hosp for hosp in hospitals 
                 if user_input_clean in self._safe_get(hosp, 'hospitalName', '').lower()), 
                None
            )

        if selected_hospital:
            self.awaiting_hospital_selection[session_id] = False
            return self._handle_doctor_matching(session_id, selected_hospital)
        else:
            # Invalid selection, show options again
            hospitals_list = []
            for i, hospital in enumerate(hospitals, 1):
                name = self._safe_get(hospital, 'hospitalName', f'Hospital {i}')
                location = self._safe_get(hospital, 'location', 'Location not specified')
                hospitals_list.append(f"{i}. {name} - {location}")

            response = "Sorry, I couldn't match that selection. Please choose from these hospitals:\n\n"
            response += "\n".join(hospitals_list)
            response += "\n\nPlease reply with the hospital number or name."
            return response

    def _handle_doctor_matching(self, session_id, hospital):
        """Handle doctor matching for selected hospital"""
        try:
            symptoms = self.pending_symptoms.get(session_id, "general consultation")
            # Call the agent's main doctor matching method
            match_result = self.doctor_matching_agent.match_doctors(symptoms, hospital)
            doctors = match_result.get("doctors", [])
            
            if not doctors:
                return "Unfortunately, no doctors are available at this hospital for your symptoms right now. Please try contacting the hospital directly or choose another hospital."

            if len(doctors) == 1:
                doctor = doctors[0]
                try:
                    notification_result = self.doctor_notification_agent.notify_doctor(doctor)
                    response = notification_result.get("message", {})
                    response_text = f"Doctor {response.get('doctorName', 'N/A')} ({doctor.get('specialty', 'N/A')}) has been notified. {response.get('message', '')}"
                except Exception as e:
                    logging.error(f"Error notifying doctor: {e}")
                    response_text = "There was a problem contacting the doctor. Please try again later."
                
                self.session_histories[session_id].append({"role": "assistant", "content": response_text})
                return response_text

            self.awaiting_doctor_selection[session_id] = doctors

            doctors_list = []
            for i, doctor in enumerate(doctors, 1):
                name = self._safe_get(doctor, 'name', f'Doctor {i}')
                specialty = self._safe_get(doctor, 'specialty', 'General Medicine')
                doctors_list.append(f"{i}. {name} - {specialty}")

            response = f"I found multiple doctors available at {self._safe_get(hospital, 'hospitalName', 'the selected hospital')}. Please choose one:\n\n"
            response += "\n".join(doctors_list)
            response += "\n\nPlease reply with the doctor number or name."

            self.session_histories[session_id].append({"role": "assistant", "content": response})
            return response

        except Exception as e:
            logging.error(f"Error in doctor matching: {e}")
            return "I encountered an error while finding doctors. Please try again later."

    def _safe_get(self, obj, key, default=""):
        return obj[key] if isinstance(obj, dict) and key in obj else default

    def _handle_doctor_selection(self, user_input, session_id):
        doctors = self.awaiting_doctor_selection.get(session_id, [])
        user_input_clean = user_input.strip().lower()

        try:
            doctor_number = int(user_input_clean)
            if 1 <= doctor_number <= len(doctors):
                selected_doctor = doctors[doctor_number - 1]
            else:
                selected_doctor = None
        except ValueError:
            selected_doctor = next((doc for doc in doctors if user_input_clean in doc.get("name", "").lower()), None)

        if selected_doctor:
            self.awaiting_doctor_selection[session_id] = []
            try:
                notification_result = self.doctor_notification_agent.notify_doctor(selected_doctor)
                response = notification_result.get("message", {})
                response_text = f"Doctor {response.get('doctorName', 'N/A')} ({selected_doctor.get('specialty', 'N/A')}) has been notified. {response.get('message', '')}"
            except Exception as e:
                logging.error(f"Error notifying doctor: {e}")
                response_text = "There was a problem contacting the doctor. Please try again later."
            self.session_histories[session_id].append({"role": "assistant", "content": response_text})
            return response_text
        else:
            doctors_list = [f"{i+1}. {doc.get('name', 'Doctor')} - {doc.get('specialty', 'Specialty not listed')}" for i, doc in enumerate(doctors)]
            response = "Sorry, I couldn't match that selection. Please choose from these doctors:\n\n" + "\n".join(doctors_list)
            response += "\n\nPlease reply with the doctor number or name."
            return response