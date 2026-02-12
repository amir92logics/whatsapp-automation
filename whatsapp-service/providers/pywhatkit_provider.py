import pywhatkit
import datetime

def send_message(phone, message):
    try:
        # pywhatkit sends message after a delay. This requires an active WhatsApp Web session.
        # Adding some buffer for pywhatkit to open tab and type
        import time
        # Increased wait_time to 20s for slow internet/loading and 4s post-send sleep
        pywhatkit.sendwhatmsg_instantly(f"+{phone}", message, wait_time=20, tab_close=True)
        time.sleep(4) 
        return {"status": "SENT", "provider": "pywhatkit"}
    except Exception as e:
        return {"status": "FAILED", "provider": "pywhatkit", "error": str(e)}
