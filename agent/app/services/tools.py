import requests
import json
import logging
from langchain.tools import tool
from config import DOCTOR_DB_API_URL, HOSPITAL_DB_API_URL

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def _get_all_hospitals_raw() -> str:
    """
    Raw function to fetch all hospitals from the API.
    Returns JSON string with list of hospitals.
    """
    try:
        logging.info(f"Fetching hospitals from: {HOSPITAL_DB_API_URL}")
        response = requests.get(HOSPITAL_DB_API_URL, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            hospitals = data.get("hospitals", [])
            logging.info(f"Successfully fetched {len(hospitals)} hospitals.")
            return json.dumps(hospitals)
        else:
            logging.error(f"Hospital API returned status {response.status_code}: {response.text}")
            return json.dumps([])
            
    except requests.exceptions.Timeout:
        logging.error("Timeout fetching hospitals from API.")
        return json.dumps([])
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error fetching hospitals: {e}")
        return json.dumps([])
    except json.JSONDecodeError as e:
        logging.error(f"JSON decode error: {e}")
        return json.dumps([])
    except Exception as e:
        logging.error(f"Unexpected error fetching hospitals: {e}")
        return json.dumps([])

@tool
def get_all_hospitals(dummy_input: str = "") -> str:
    """
    LangChain tool to fetch all hospitals.
    Input parameter is ignored - this tool doesn't need any input.
    Returns JSON string with hospitals list.
    """
    logging.debug("LangChain tool 'get_all_hospitals' called.")
    return _get_all_hospitals_raw()

@tool
def get_doctors_by_hospital_and_symptoms(input_str: str) -> str:
    """
    Find doctors based on hospital name and symptoms.
    
    Args:
        input_str: JSON string with 'hospital' and 'symptoms' keys.
                  Example: '{"hospital": "Get Well Hospital", "symptoms": "fever, cough"}'
    
    Returns:
        JSON string with list of doctor dictionaries.
    """
    try:
        logging.info(f"Tool called with input: {input_str}")
        
        # Handle empty or invalid input
        if not input_str or input_str.strip().lower() in ["none", "null", "{}", ""]:
            logging.warning("Empty or invalid input provided")
            return json.dumps({"error": "Hospital and symptoms required"})
        
        # Parse input
        try:
            data = json.loads(input_str)
        except json.JSONDecodeError:
            logging.warning(f"Non-JSON input received: {input_str}")
            return json.dumps({"error": "Invalid JSON input format"})
        
        hospital = data.get("hospital", "").strip()
        symptoms = data.get("symptoms", "").strip()
        
        if not hospital or not symptoms:
            logging.warning("Missing hospital or symptoms in input")
            return json.dumps({"error": "Both hospital and symptoms are required"})
        
        # Call the API with proper endpoint handling
        logging.info(f"Querying doctors API - Hospital: '{hospital}', Symptoms: '{symptoms}'")
        
        # Ensure the API URL is correctly formatted
        api_url = DOCTOR_DB_API_URL
        if not api_url.endswith('/getdoctorbyhospital'):
            if api_url.endswith('/'):
                api_url = api_url + 'getdoctorbyhospital'
            else:
                api_url = api_url + '/getdoctorbyhospital'
        
        # Make the API request
        response = requests.get(
            api_url,
            params={"hospital": hospital, "symptoms": symptoms},
            timeout=10
        )
        
        logging.info(f"API Request URL: {response.url}")
        logging.info(f"API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            api_data = response.json()
            logging.info(f"API Response Data: {api_data}")
            
            doctors_list = []
            hospital_id = api_data.get("hospitalId", "")
            
            # Parse the API response structure
            # Expected format: {"hospitalId": "...", "Hospital Name": [doctors]}
            for key, value in api_data.items():
                if key != "hospitalId" and isinstance(value, list):
                    hospital_name = key
                    doctors_in_hospital = value
                    
                    for doctor in doctors_in_hospital:
                        if isinstance(doctor, dict):
                            doctor_info = doctor.copy()
                            doctor_info["hospital"] = hospital_name
                            doctor_info["hospitalId"] = hospital_id
                            
                            # Ensure 'specialty' field exists (map from 'field' if needed)
                            if "field" in doctor_info and "specialty" not in doctor_info:
                                doctor_info["specialty"] = doctor_info["field"]
                            
                            doctors_list.append(doctor_info)
            
            logging.info(f"Found {len(doctors_list)} doctors for '{hospital}' with symptoms '{symptoms}'")
            return json.dumps(doctors_list)
        
        else:
            logging.error(f"Doctor API error - Status: {response.status_code}")
            logging.error(f"Response text: {response.text}")
            return json.dumps({"error": f"API returned status {response.status_code}"})
    
    except requests.exceptions.Timeout:
        logging.error("Timeout occurred while fetching doctors")
        return json.dumps({"error": "Request timeout"})
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error fetching doctors: {e}")
        return json.dumps({"error": f"Request failed: {str(e)}"})
    except Exception as e:
        logging.error(f"Unexpected error in get_doctors_by_hospital_and_symptoms: {e}")
        return json.dumps({"error": f"Unexpected error: {str(e)}"})

# Utility function for testing
def test_tools():
    """Test function to verify tools work correctly"""
    try:
        print("=== Testing Tools ===")
        
        # Test hospitals
        print("\n1. Testing get_all_hospitals...")
        hospitals_result = get_all_hospitals.invoke("")
        hospitals = json.loads(hospitals_result)
        print(f"Hospitals result: Found {len(hospitals)} hospitals")
        
        if hospitals:
            print(f"First hospital: {hospitals[0]}")
            
            # Test doctors with first hospital
            print("\n2. Testing get_doctors_by_hospital_and_symptoms...")
            hospital_name = hospitals[0].get("hospitalName", "Get Well Hospital")
            test_input = json.dumps({"hospital": hospital_name, "symptoms": "fever cough"})
            
            doctors_result = get_doctors_by_hospital_and_symptoms.invoke(test_input)
            doctors = json.loads(doctors_result)
            
            if isinstance(doctors, dict) and "error" in doctors:
                print(f"Doctors result: Error - {doctors['error']}")
            else:
                print(f"Doctors result: Found {len(doctors)} doctors")
                if doctors:
                    print(f"First doctor: {doctors[0]}")
        else:
            print("No hospitals found - cannot test doctor search")
        
    except Exception as e:
        print(f"Test error: {e}")

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
