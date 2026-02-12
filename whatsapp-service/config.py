import os
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_PROVIDER = os.getenv("WHATSAPP_PROVIDER", "pywhatkit") # pywhatkit | cloudAPI
CLOUD_API_TOKEN = os.getenv("CLOUD_API_TOKEN", "")
CLOUD_API_PHONE_ID = os.getenv("CLOUD_API_PHONE_ID", "")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "am-automation-studio-secret")
