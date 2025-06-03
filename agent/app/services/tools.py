from langchain.tools import tool
import requests, json
from twilio.rest import Client
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM_NUMBER
from config import DOCTOR_DB_API_URL, WHATSAPP_API_URL, WHATSAPP_API_TOKEN, HOSPITAL_DB_API_URL

@tool
def get_all_hospitals() -> str:
    """Fetch a list of all hospitals from the hospital API."""
    try:
        response = requests.get(HOSPITAL_DB_API_URL)
        if response.status_code == 200:
            data = response.json()
            # Extract the hospitals array from the wrapped response
            hospitals = data.get("hospitals", [])
            return json.dumps(hospitals)
        else:
            return "[]"
    except Exception as e:
        print(f"Error fetching hospitals: {e}")
        return "[]"


@tool
def get_doctors_by_hospital_and_symptoms(input_str: str) -> str:
    """Fetch a list of doctors based on the selected hospital and provided symptoms."""
    try:
        data = json.loads(input_str)
        hospital = data.get("hospital", "")
        symptoms = data.get("symptoms", "")
        if not hospital or not symptoms:
            return "Error: hospital and symptoms must be provided."
    except json.JSONDecodeError:
        return "Error: input is not valid JSON."

    api_url = DOCTOR_DB_API_URL
    
    # Fix: API expects {"hospitalName": "..."} not {"hospital": "..."}
    payload = {
        "hospitalName": hospital
    }
    
    try:
        response = requests.post(api_url, json=payload)
        print(f"Doctor API Status: {response.status_code}")
        print(f"Doctor API Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            # Extract the doctors array from the wrapped response
            doctors = data.get("doctors", [])
            return json.dumps(doctors)
        else:
            return "[]"
    except Exception as e:
        print(f"Error fetching doctors: {e}")
        return "[]"


@tool
def generate_whatsapp_link(doctor_contact: str, message: str) -> str:
    """
    Generate a WhatsApp link with a pre-filled message that the user can use to contact the doctor.
    Returns a wa.me link.
    """
    import urllib.parse

    if not doctor_contact:
        return "Phone number not provided."

    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{doctor_contact}?text={encoded_message}"
