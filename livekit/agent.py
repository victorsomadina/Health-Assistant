import logging
import json
import asyncio
from dotenv import load_dotenv
import os
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    RoomInputOptions,
    RoomOutputOptions,
    WorkerOptions,
    cli,
    metrics,
    get_job_context
)
from livekit.agents.voice import MetricsCollectedEvent, RunContext
from livekit.plugins import deepgram, openai, silero
from livekit import api
from livekit.plugins import groq
from livekit.agents.llm import function_tool
from livekit import rtc, api
from dataclasses import dataclass
from typing import Optional, Dict, List
import aiohttp

logger = logging.getLogger("medical_ai_agent")
logger.setLevel(logging.INFO)

load_dotenv()

# API Configuration
API_BASE_URL = "https://wc2sdbj8-3000.uks1.devtunnels.ms/api/assistant"
HOSPITALS_ENDPOINT = f"{API_BASE_URL}/gethospital"
DOCTORS_ENDPOINT = f"{API_BASE_URL}/getdoctorbyhospital"

@dataclass
class MedicalUserData:
    ctx: JobContext
    session: Optional[AgentSession] = None
    selected_hospital: Optional[str] = None
    selected_hospital_id: Optional[str] = None
    selected_doctor: Optional[str] = None
    selected_doctor_id: Optional[str] = None
    selected_doctor_field: Optional[str] = None
    patient_name: Optional[str] = None
    patient_email: Optional[str] = None
    patient_location: Optional[str] = None

class MedicalAIAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""
            You are a **First Aid Medical AI Assistant** designed to provide quick, preliminary medical help, general health guidance, and doctor referral support. Your interaction mode is **Voice**. You are equipped with tools: [get_doctors_at_hospital], [get_available_hospitals], [collect_patient_details].

🩺 **Primary Role and Focus:**
- First and foremost, help users with their **first aid concerns** by giving **clear, concise medical advice**.
- Only recommend seeing a doctor if the situation **needs further medical attention**.
- Maintain a **calm, warm, and supportive tone** at all times.

---
## 🚑 FIRST AID FLOW (Start every interaction with this):

1. **Start with Empathy & Understanding**  
   Say: *"I understand you're concerned about your health. Let me help with some quick first aid guidance first."*

2. **Ask Clarifying Questions** to better understand the situation:  
   - "When did the symptoms start?"
   - "How severe is the pain on a scale of 1–10?"
   - "Any other symptoms you’ve noticed?"
   - "Are you taking any medications?"

3. **Give First Aid Guidance**  
   - Explain what the symptoms might mean in **simple language**.
   - Suggest **safe home remedies** or actions when appropriate.
   - Use phrases like:  
     *"This sounds like it could be..."*,  
     *"You can try..."*,  
     *"If it doesn't improve within a few hours..."*

4. **Recognize Emergencies & Refer** if needed  
   - Immediately say:  
     *"This may be serious. I recommend you seek emergency medical attention right away."*

5. **Refer to Doctor Only if Needed**  
   - If the issue requires professional care.
   - If user explicitely ssk to be referred to a doctor.
   - move to the **Doctor Appointment Flow** below.

**For Doctor Appointments - FOLLOW THIS EXACT STEP-BY-STEP FLOW:**

**Step 1: Ask for Location**
- Ask: "What city or area are you located in?"
- Wait for user response

**Step 2: Get and Present Hospitals**
- Use [get_available_hospitals] with their location
- Read the  hospitals in numbered list and ask user to choose:
  "Available hospitals in [location]:
  1. Hospital Name A in Location
  2. Hospital Name B in Location
  
  Which hospital would you prefer? Please tell me the number or name."
- WAIT for user to choose before proceeding

**Step 3: Confirm Hospital Choice**
- Confirm their selection: "Great! You've chosen [Hospital Name]. Let me get the available doctors there."
- Use [get_doctors_at_hospital] only after confirmation
- WAIT for this to complete

**Step 4: Present Doctors**
- Read the  doctors in numbered list format and ask user to choose:
  "Available doctors at [Hospital Name]:
  1. Dr. Name A (Specialty)
  2. Dr. Name B (Specialty)
  
  Which doctor would you like to see? Please tell me the number or name."
- WAIT for user to choose

**Step 5: Confirm Doctor Choice**
- Confirm: "Perfect! You've chosen Dr. [Name]. Now I need your contact information."
- Ask: "What's your full name?"
- WAIT for response

**Step 6: Collect Patient Details**
- After getting name, ask: "What's your email address?" (make sure you ask for email address after name)
- WAIT for response
- Use [collect_patient_details] with name, email, and doctor name
- WAIT for this to complete

**Step 7: Send Appointment Email**
- Send appointment details to anigilajeyusuf@gmail.com using MCP
- Include: patient name, email, selected hospital, selected doctor, and current date/time
- Confirm to patient: "Perfect! I've sent your appointment request. You should hear back soon about scheduling."

**CRITICAL CONVERSATION RULES:**
- Always WAIT for user response before each next step
- Always confirm each selection before proceeding
- Present options in numbered lists for easy selection
- Be conversational, patient, and warm

If user pronunciation or text is incorrect when selecting doctor or hospital, try to make sense of the word.
You can rewrite based on tools data you have access to.

**Communication Guidelines:**
- Speak clearly and conversationally
- Keep responses concise (1-2 sentences)
- Read lists in a clear, numbered format
- Always confirm user selections
- Use natural language like "Which hospital would you prefer?" or "Please say the name of the doctor you'd like to see"
- **Always start with empathy**: "I understand you're concerned about your health. Let me help you with some preliminary information."

Important: Do not mention the tools you use to the user when making a function call, just say the results from the function, do not mention what tools you will use.

**General Medical Information Guidelines:**
1. **Ask clarifying questions** to better understand symptoms:
   - "When did these symptoms start?"
   - "How severe would you rate the pain/discomfort on a scale of 1-10?"
   - "Have you noticed any triggers or patterns?"
   - "Are you currently taking any medications?"

2. **Provide helpful information** while being clear about limitations:
   - Explain possible causes in simple terms
   - Suggest general self-care measures when appropriate
   - Always mention when professional consultation is needed

3. **Emergency Recognition** - Immediately recommend emergency care for:
   - Chest pain or difficulty breathing
   - Severe allergic reactions
   - Signs of stroke (FAST symptoms)
   - Severe injuries or bleeding
   - Suicidal thoughts or mental health crises
   - Any life-threatening symptoms

4. **Safety Disclaimers**:
   - "This information is for educational purposes only"
   - "I cannot replace professional medical diagnosis"
   - "Please consult a healthcare provider for proper evaluation"

5. **Tone and Approach**:
   - Be warm, caring, and non-judgmental
   - Use simple, understandable language
   - Avoid medical jargon unless explaining it
   - Show genuine concern for their wellbeing
   - Be encouraging and supportive

6. **When to Refer**:
   - Symptoms persist or worsen
   - Patient expresses serious concern
   - Complex medical history
   - Need for physical examination
   - Prescription medications needed
   - Mental health concerns

IMPORTANT: BE SIMPLE AND CONCISE, your responses should not be lengthy(2-3 sentences). Go straight to the point.

**Email Sending Instructions:**
When you have collected all patient details and they have selected a doctor, use the MCP Gmail server integration to send an email to anigilajeyusuf@gmail.com with the following format:

Subject: "New Appointment Request - [Patient Name]"
Body: 
"Dear Doctor,

A new appointment request has been submitted:

Patient Name: [Patient Name]
Patient Email: [Patient Email]
Selected Hospital: [Hospital Name]
Selected Doctor: [Doctor Name]
Doctor Specialty: [Doctor Field]

Please contact the patient to confirm the appointment.

Best regards,
Medical AI Assistant"
"""
        )
        self._session = None

    @property
    def session(self):
        return self._session

    @session.setter
    def session(self, value):
        self._session = value

    async def _make_api_request(self, url: str, method: str = "GET", data: dict = None) -> dict:
        """
        Makes HTTP requests to the API endpoints with improved error handling
        """
        try:
            timeout = aiohttp.ClientTimeout(total=10)  # 10 second timeout
            async with aiohttp.ClientSession(timeout=timeout) as session:
                if method.upper() == "GET":
                    async with session.get(url) as response:
                        logger.info(f"GET {url} - Status: {response.status}")
                        if response.status == 200:
                            result = await response.json()
                            logger.info(f"GET response: {json.dumps(result, indent=2)}")
                            return result
                        else:
                            logger.error(f"GET request failed with status {response.status}")
                            return None
                elif method.upper() == "POST":
                    headers = {"Content-Type": "application/json"}
                    async with session.post(url, json=data, headers=headers) as response:
                        logger.info(f"POST {url} - Status: {response.status}")
                        logger.info(f"POST payload: {json.dumps(data, indent=2)}")
                        if response.status == 200:
                            result = await response.json()
                            logger.info(f"POST response: {json.dumps(result, indent=2)}")
                            return result
                        else:
                            response_text = await response.text()
                            logger.error(f"POST request failed with status {response.status}: {response_text}")
                            return None
        except asyncio.TimeoutError:
            logger.error(f"Request to {url} timed out")
            return None
        except Exception as e:
            logger.error(f"Error making API request to {url}: {e}")
            return None
        

    @function_tool
    async def get_available_hospitals(self, location: str = "") -> str:
        """
        Retrieves available hospitals from the API, optionally filtered by location.
        The assistant will read these to the patient.
        
        Args:
            location: Optional city/state to filter hospitals (e.g. "Lagos")
        """
        try:
            # Get context to store location
            if self.session and hasattr(self.session, 'userdata'):
                context = self.session.userdata
                context.patient_location = location
            
            # Fetch hospitals from API
            response = await self._make_api_request(HOSPITALS_ENDPOINT)
            
            if not response or "hospitals" not in response:
                return "I couldn't retrieve the hospitals list at the moment. Please try again."
            
            hospitals = response["hospitals"]
            
            if location:
                # Filter hospitals by location (case insensitive)
                filtered_hospitals = [h for h in hospitals if location.lower() in h["location"].lower()]
                if filtered_hospitals:
                    hospitals = filtered_hospitals
                else:
                    # If no match found, show all hospitals
                    pass
            
            if not hospitals:
                return "No hospitals are currently available. Please try again later."
            
            hospital_list = []
            for i, hospital in enumerate(hospitals, 1):
                hospital_list.append(f"{i}. {hospital['hospitalName']} in {hospital['location']}")
            
            hospitals_text = "\n".join(hospital_list)
            location_text = f" in {location}" if location else ""
            return f"Available hospitals{location_text}:\n{hospitals_text}\n\nWhich hospital would you prefer? Please tell me the number or name."
            
        except Exception as e:
            logger.error(f"Error getting hospitals: {e}")
            return "I couldn't retrieve the hospitals list. Please try again."

    @function_tool
    async def get_doctors_at_hospital(self, hospital_name: str) -> str:
        """
        Retrieves available doctors at a specific hospital from the API.
        The assistant will read these to the patient.
        
        Args:
            hospital_name: Name of the hospital to get doctors for
        """
        try:
            # Get context from agent session
            if not self.session or not hasattr(self.session, 'userdata'):
                return "Session not properly initialized. Please try again."
                
            context = self.session.userdata
            
            # First, get all hospitals to find the exact hospital info
            hospitals_response = await self._make_api_request(HOSPITALS_ENDPOINT)
            
            if not hospitals_response or "hospitals" not in hospitals_response:
                return "I couldn't retrieve hospital information. Please try again."
            
            # Find matching hospital (case insensitive, flexible matching)
            matched_hospital = None
            for hospital in hospitals_response["hospitals"]:
                hospital_lower = hospital["hospitalName"].lower()
                input_lower = hospital_name.lower()
                # Check if hospital name contains input or input contains hospital name
                if (input_lower in hospital_lower or 
                    hospital_lower in input_lower or
                    # Check for number-based selection (e.g., "1", "2", etc.)
                    (hospital_name.isdigit() and int(hospital_name) <= len(hospitals_response["hospitals"]))):
                    
                    if hospital_name.isdigit():
                        # Handle number selection
                        index = int(hospital_name) - 1
                        if 0 <= index < len(hospitals_response["hospitals"]):
                            matched_hospital = hospitals_response["hospitals"][index]
                    else:
                        matched_hospital = hospital
                    break
            
            if not matched_hospital:
                return "I couldn't find that hospital. Please choose from the available hospitals by name or number."
            
            # Store hospital selection
            context.selected_hospital = matched_hospital["hospitalName"]
            context.selected_hospital_id = matched_hospital["id"]
            
            # CORRECTED: Use hospitalName instead of hospitalId for the POST request
            doctors_data = {"hospitalName": matched_hospital["hospitalName"]}
            doctors_response = await self._make_api_request(DOCTORS_ENDPOINT, "POST", doctors_data)
            
            if not doctors_response:
                return f"I couldn't retrieve doctors for {matched_hospital['hospitalName']}. Please try again."
            
            # CORRECTED: Handle the response structure properly
            # The response has the hospital name as key, not "doctors"
            hospital_key = matched_hospital["hospitalName"]
            
            # The response might have the doctors under the hospital name key
            doctors = None
            if hospital_key in doctors_response:
                doctors = doctors_response[hospital_key]
            elif "doctors" in doctors_response:
                doctors = doctors_response["doctors"]
            else:
                # Sometimes the response structure might be different
                # Let's check all keys to find the doctors array
                for key, value in doctors_response.items():
                    if isinstance(value, list) and value:
                        doctors = value
                        break
            
            if not doctors:
                return f"No doctors found for {matched_hospital['hospitalName']}. Please choose another hospital."
            
            # Format doctor information
            doctor_list = []
            for i, doctor in enumerate(doctors, 1):
                name = doctor.get("name", "Unknown")
                field = doctor.get("field", "General Practice")
                location = doctor.get("location", "")
                doctor_info = f"{i}. Dr. {name} - {field}"
                if location and location != matched_hospital["hospitalName"]:
                    doctor_info += f" at {location}"
                doctor_list.append(doctor_info)
            
            doctors_text = "\n".join(doctor_list)
            return f"Available doctors at {matched_hospital['hospitalName']}:\n{doctors_text}\n\nWhich doctor would you like to see? Please tell me the number or name."
            
        except Exception as e:
            logger.error(f"Error getting doctors: {e}")
            return "I couldn't retrieve the doctors list. Please try again."

    @function_tool
    async def collect_patient_details(self, name: str, email: str, doctor_name: str) -> str:
        """
        Collects patient details needed for the appointment and stores selected doctor info.
        
        Args:
            name: Patient's full name
            email: Patient's email address
            doctor_name: Name of the selected doctor
        """
        try:
            # Get context from agent session
            if not self.session or not hasattr(self.session, 'userdata'):
                return "Session not properly initialized. Please try again."
                
            context = self.session.userdata
            
            # Validate email format
            if "@" not in email or "." not in email:
                return "Please provide a valid email address."
            
            context.patient_name = name
            context.patient_email = email
            
            # Get the selected doctor's details
            if context.selected_hospital and context.selected_hospital_id:
                # Use the corrected API call
                doctors_data = {"hospitalName": context.selected_hospital}
                doctors_response = await self._make_api_request(DOCTORS_ENDPOINT, "POST", doctors_data)
                
                if doctors_response:
                    # Find doctors in the response
                    doctors = None
                    if context.selected_hospital in doctors_response:
                        doctors = doctors_response[context.selected_hospital]
                    elif "doctors" in doctors_response:
                        doctors = doctors_response["doctors"]
                    else:
                        # Check all keys for list of doctors
                        for key, value in doctors_response.items():
                            if isinstance(value, list) and value:
                                doctors = value
                                break
                    
                    if doctors:
                        # Find the selected doctor (flexible matching)
                        selected_doctor = None
                        doctor_input_lower = doctor_name.lower()
                        
                        # Check for number-based selection
                        if doctor_name.isdigit():
                            index = int(doctor_name) - 1
                            if 0 <= index < len(doctors):
                                selected_doctor = doctors[index]
                        else:
                            # Name-based matching
                            for doctor in doctors:
                                doctor_name_full = doctor.get("name", "")
                                if (doctor_input_lower in doctor_name_full.lower() or 
                                    doctor_name_full.lower() in doctor_input_lower):
                                    selected_doctor = doctor
                                    break
                        
                        if selected_doctor:
                            context.selected_doctor = selected_doctor["name"]
                            context.selected_doctor_id = selected_doctor.get("id", "")
                            context.selected_doctor_field = selected_doctor.get("field", "General Practice")
                        else:
                            # Fallback to the provided name
                            context.selected_doctor = doctor_name
                            context.selected_doctor_field = "General Practice"
                    else:
                        context.selected_doctor = doctor_name
                        context.selected_doctor_field = "General Practice"
            
            return f"Thank you {name}. I have your details and doctor selection. I'll now send your appointment request."
            
        except Exception as e:
            logger.error(f"Error collecting patient details: {e}")
            return "There was an error processing your details. Please try again."

    # async def on_enter(self):
    #     """Called when the agent session starts"""
    #     await self.session.generate_reply( instructions=f"""say eactly as this : Welcome to WeHelp medical Assistant, How can I help you today?""")

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
        "user_id": "medical_patient",
    }
    await ctx.connect()
    logger.info("Connected to medical consultation room")

    # Initialize user data
    userdata = MedicalUserData(ctx=ctx)

    session = AgentSession[MedicalUserData](
        userdata=userdata,
        vad=ctx.proc.userdata["vad"],
        llm=groq.LLM(model="llama-3.3-70b-versatile"),
        stt=deepgram.STT(model="nova-2", language="en-US"),
        tts=deepgram.TTS()

    )
    
     
    
    # Set userdata session reference
    userdata.session = session
    
    logger.info("Medical AI session components initialized")

    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
            
    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Medical consultation usage summary: {summary}")

    async def delete_room():
        async with api.LiveKitAPI(
            os.getenv("LIVEKIT_URL"),
            os.getenv("LIVEKIT_API_KEY"),
            os.getenv("LIVEKIT_API_SECRET")
        ) as api_client:
            await api_client.room.delete_room(api.DeleteRoomRequest(
                room=ctx.room.name,
            ))
            logger.info("Medical consultation room deleted successfully")

    ctx.add_shutdown_callback(log_usage)  
    ctx.add_shutdown_callback(delete_room) 

    await ctx.wait_for_participant()
    logger.info("Patient connected to medical consultation")

    agent = MedicalAIAgent()
    agent.session = session

    try:
        await session.start(
            room=ctx.room,
            agent=agent,
            room_input_options=RoomInputOptions(
                text_enabled=True,
                audio_enabled=True
            ),
            room_output_options=RoomOutputOptions(
                transcription_enabled=True,
                audio_enabled=True
            ),
        )
        logger.info("Medical AI session started successfully")
    except Exception as e:
        logger.error(f"Failed to start medical AI session: {str(e)}", exc_info=True)
        raise
    
    await session.say(" Hello! I’m WeHelp, your first-aid assistant. What health concern can I help you with today?", allow_interruptions=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))


