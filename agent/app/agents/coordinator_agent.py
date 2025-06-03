import json
import logging
from .first_aid_agent import FirstAidAgent
from .doctor_matching_agent import DoctorMatchingAgent
from .doctor_notification_agent import DoctorNotificationAgent
from together import Together
from config import TOGETHER_API_KEY

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
        self.session_histories = {}
        self.first_aid_turn_count = {}

    def handle_conversation(self, user_input, session_id="default", history=None):
        user_input_clean = user_input.strip().lower()

        self._initialize_session(session_id)
        history = self.session_histories[session_id]
        history.append({"role": "user", "content": user_input})
        logging.debug(f"Session ID: {session_id}, User Input: {user_input}")

        # 1. If awaiting doctor selection
        if self.awaiting_doctor_selection[session_id]:
            return self._handle_doctor_selection(user_input, session_id)

        # 2. if user explicitly wants to find a doctor
        if self._user_wants_doctor(user_input_clean):
            symptoms = self.pending_symptoms.get(session_id, user_input)
            if not symptoms:
                symptoms = user_input
            self.pending_symptoms[session_id] = symptoms
            self.first_aid_complete[session_id] = True
            return self._handle_doctor_matching(session_id)

        # 3. if reasoning model determines user is ready for doctor
        reasoning = self._reasoning_model(user_input, session_id)
        if reasoning.get("status") == "done":
            symptoms = reasoning.get("symptoms", user_input)
            self.pending_symptoms[session_id] = symptoms
            self.first_aid_complete[session_id] = True
            return self._handle_doctor_matching(session_id)

        # 4. Continue first aid
        return self._handle_first_aid(user_input, session_id)

    def _user_wants_doctor(self, user_input_clean):
        """Check if user explicitly wants to find a doctor"""
        doctor_keywords = [
            "yes", "find doctor", "need doctor", "see doctor", 
            "connect doctor", "match doctor", "doctor help",
            "medical help", "professional help"
        ]
        return any(keyword in user_input_clean for keyword in doctor_keywords)

    def _initialize_session(self, session_id):
        self.first_aid_complete.setdefault(session_id, False)
        self.pending_symptoms.setdefault(session_id, None)
        self.session_histories.setdefault(session_id, [])
        self.awaiting_doctor_selection.setdefault(session_id, [])
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
        context_summary = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-5:]])  # Last 5 messages
        
        prompt = f"""
You are a medical reasoning engine. Given a conversation between a user and a first-aid assistant, determine:

1. Whether the user is ready to be connected to a doctor.
2. If yes, extract the user's symptoms (as a short text string).

Respond in **only** this JSON format:
{{
"status": "done" or "not_done",
"symptoms": "..." (if any)
}}

Recent conversation:
{context_summary}
Latest user input: {user_input}
"""

        try:
            response = self.client.chat.completions.create(
                model="meta-llama/Llama-3-70B-Instruct-Turbo-Free",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )
            reply = response.choices[0].message.content.strip()
            logging.debug(f"[Reasoning Model Reply] {reply}")
            
            
            if reply.startswith('{') and reply.endswith('}'):
                return json.loads(reply)
            else:
                
                import re
                json_match = re.search(r'\{[^}]+\}', reply)
                if json_match:
                    return json.loads(json_match.group())
            
            return {"status": "not_done", "symptoms": ""}
            
        except Exception as e:
            logging.error(f"[Reasoning Model Error]: {e}")
            return {"status": "not_done", "symptoms": ""}

    def _handle_doctor_matching(self, session_id):
        symptoms = self.pending_symptoms.get(session_id, "")
        logging.debug(f"Handling doctor matching for symptoms: {symptoms}")
        
        try:
            # Get hospitals
            hospitals = self.doctor_matching_agent.get_hospitals()
            logging.debug(f"Available hospitals: {hospitals}")
            
            if not hospitals:
                return "Unfortunately, no hospitals are available right now. Please try contacting your local healthcare provider directly."

            selected_hospital = hospitals[0]
            logging.debug(f"Selected hospital: {selected_hospital}")
            
            # Match doctors
            result = self.doctor_matching_agent.match_doctors(symptoms, selected_hospital)
            logging.debug(f"Doctor matching result: {result}")
            
            doctors = result.get("doctors", [])
            suggestion = result.get("llm_response", "Based on your symptoms, here are some doctors who can help you.")

            if not doctors:
                fallback_msg = f"{suggestion}\n\nNo specific matching doctors were found at this time. I recommend contacting {selected_hospital.get('name', 'your local hospital')} directly at {selected_hospital.get('phone', 'their main number')} for assistance."
                self.session_histories[session_id].append({"role": "assistant", "content": fallback_msg})
                return fallback_msg


            self.awaiting_doctor_selection[session_id] = doctors


            doctors_list = []
            for i, doc in enumerate(doctors, 1):
                name = doc.get("name", "Unknown")
                field = doc.get("field", "General Practice")
                location = doc.get("location", selected_hospital.get("name", "Unknown"))
                doctors_list.append(f"{i}. Dr. {name} - {field} ({location})")

            response = f"{suggestion}\n\nHere are the available doctors:\n" + "\n".join(doctors_list)
            response += "\n\nPlease reply with the *full name* of the doctor you'd like me to contact (e.g., 'Dr. Smith')."
            
            self.session_histories[session_id].append({"role": "assistant", "content": response})
            return response

        except Exception as e:
            logging.error(f"Error in doctor matching: {e}")
            error_msg = "I encountered an error while trying to find doctors. Please try again later or contact your healthcare provider directly."
            self.session_histories[session_id].append({"role": "assistant", "content": error_msg})
            return error_msg

    def _handle_doctor_selection(self, user_input, session_id):
        doctors = self.awaiting_doctor_selection[session_id]
        selected_doctor = None
        

        user_input_lower = user_input.lower()
        for doc in doctors:
            doc_name = doc.get("name", "").lower()
            if doc_name in user_input_lower or user_input_lower in doc_name:
                selected_doctor = doc
                break

        if selected_doctor:
            message = self.notify_doctor(selected_doctor, self.pending_symptoms[session_id])
            self.reset_session(session_id)
            self.session_histories[session_id].append({"role": "assistant", "content": message})
            return message
        else:

            doctors_list = []
            for i, doc in enumerate(doctors, 1):
                name = doc.get("name", "Unknown")
                field = doc.get("field", "General Practice")
                doctors_list.append(f"{i}. Dr. {name} - {field}")
            
            response = "Sorry, I couldn't match that name. Please choose from these available doctors:\n"
            response += "\n".join(doctors_list)
            response += "\n\nPlease reply with the doctor's full name (e.g., 'Dr. Smith')."
            return response

    def notify_doctor(self, doctor_info, symptoms):
        patient_info = {
            "user_name": "Patient",
            "symptoms": symptoms
        }
        try:
            result = self.doctor_notification_agent.notify_doctor(doctor_info, patient_info)
            logging.debug(f"Doctor notification result: {result}")
            return result
        except Exception as e:
            logging.error(f"Error in notify_doctor: {e}")
            return f"I've noted your request to contact Dr. {doctor_info.get('name', 'the selected doctor')}. However, there was an issue with the notification system. Please contact the doctor directly or try again later."

    def reset_session(self, session_id):
        self.first_aid_complete[session_id] = False
        self.pending_symptoms[session_id] = None
        self.awaiting_doctor_selection[session_id] = []
        self.first_aid_turn_count[session_id] = 0
        