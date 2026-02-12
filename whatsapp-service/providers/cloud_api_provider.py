import requests

def send_message(phone, message, phone_number_id=None, access_token=None):
    """
    Send WhatsApp message via Cloud API with per-school credentials.
    
    Args:
        phone: Recipient phone number
        message: Message text
        phone_number_id: WhatsApp Business Phone Number ID (from school config)
        access_token: WhatsApp Business Access Token (from school config)
    """
    if not phone_number_id or not access_token:
        return {
            "status": "FAILED", 
            "provider": "cloud_api", 
            "error": "Missing Cloud API credentials (phone_number_id or access_token)"
        }
    
    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": message}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        if response.status_code == 200:
            return {"status": "SENT", "provider": "cloud_api", "response": response.json()}
        else:
            return {"status": "FAILED", "provider": "cloud_api", "error": response.text}
    except requests.Timeout:
        return {"status": "FAILED", "provider": "cloud_api", "error": "Request timeout"}
    except Exception as e:
        return {"status": "FAILED", "provider": "cloud_api", "error": str(e)}
