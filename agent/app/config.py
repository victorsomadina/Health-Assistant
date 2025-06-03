import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
DOCTOR_DB_API_URL = os.getenv("DOCTOR_DB_API_URL")
HOSPITAL_DB_API_URL = os.getenv("HOSPITAL_DB_API_URL")
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL")
WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM_NUMBER = os.getenv("TWILIO_WHATSAPP_FROM_NUMBER")


# Optional: Add warnings if critical env vars are missing
if not TOGETHER_API_KEY:
    print("Warning: TOGETHER_API_KEY not found in environment variables. Please ensure it's set in your .env file or environment.")

if not DOCTOR_DB_API_URL:
    print("Warning: DOCTOR_DB_API_URL not found in environment variables. Please ensure it's set.")

if not WHATSAPP_API_URL:
    print("Warning: WHATSAPP_API_URL not found in environment variables. Please ensure it's set.")

if not WHATSAPP_API_TOKEN:
    print("Warning: WHATSAPP_API_TOKEN not found in environment variables. Please ensure it's set.")
