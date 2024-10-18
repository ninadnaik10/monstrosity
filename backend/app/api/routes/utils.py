from decimal import Decimal

import requests
from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser
from app.models import Message
from app.utils import generate_test_email, send_email
import app.core.config as settings

router = APIRouter()


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")


@router.get("/health-check/")
async def health_check() -> bool:
    return True


@router.post("/get-distance/")
async def get_distance(data) -> Decimal:
    
    from_coords = data['from']
    to_coords = data['to']
    url = f"https://api.geoapify.com/v1/routing"
    
    params = {
        'waypoints': f"{from_coords[0]},{from_coords[1]}|{to_coords[0]},{to_coords[1]}",
        'mode': 'drive',
        'apiKey': settings.GEOAPIFY_API_KEY,
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        data = response.json()
        distance_meters = data['features'][0]['properties']['distance']
        distance_km = distance_meters / 1000
        
        return round(distance_km, 2)
    except requests.RequestException as e:
        print(f"Error calculating distance: {e}")
        return 0.0