from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from config import INTERNAL_API_KEY
import providers.pywhatkit_provider as pywhatkit
import providers.cloud_api_provider as cloud_api

app = FastAPI()

class WhatsAppRequest(BaseModel):
    phone: str
    message: str
    provider: str = "pywhatkit"  # "pywhatkit" | "cloud_api"
    phone_number_id: str | None = None  # For Cloud API
    access_token: str | None = None  # For Cloud API

def verify_api_key(x_api_key: str = Header(..., alias="X-Internal-API-Key")):
    if x_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized internal request")

import asyncio

lock = asyncio.Lock()

@app.post("/send-whatsapp", dependencies=[Depends(verify_api_key)])
async def send_whatsapp(request: WhatsAppRequest):
    # Ensure phone number is clean (no spaces, etc.) - standardizing to format liked by providers
    clean_phone = request.phone.replace(" ", "").replace("-", "").replace("+", "")
    
    async with lock:
        if request.provider == "cloud_api":
            # Cloud API doesn't need the lock (HTTP-based), but keeping for consistency
            result = cloud_api.send_message(
                clean_phone, 
                request.message,
                phone_number_id=request.phone_number_id,
                access_token=request.access_token
            )
        else:  # Default to pywhatkit
            # Run blocking pywhatkit in a thread to not block the event loop, 
            # but protected by lock so only one runs at a time
            result = await asyncio.to_thread(pywhatkit.send_message, clean_phone, request.message)
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
