from datetime import timedelta
from decimal import Decimal
from typing import Annotated, Any
import uuid

from sqlalchemy import func, select

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app import crud
from app.api.deps import CurrentUser, SessionDep,  get_current_active_superuser, CurrentDriver
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import Booking, BookingCreate, BookingPublic, BookingsPublic, Driver, Item, Location, Message, NewPassword, Token, User, UserPublic
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    get_location_details,
    send_email,
    verify_password_reset_token,
)

router = APIRouter()


@router.get("/", response_model=BookingsPublic)
def read_items(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve bookings.
    """

    
    count_statement = (
        select(func.count())
        .select_from(Booking)
    )
    count = session.exec(count_statement).one()
    statement = (
        select(Booking)
        .offset(skip)
        .limit(limit)
    )
    bookings = session.exec(statement).all()

    bookings_public = []
   
    
    for booking in bookings:
        pickup = session.get(Location, booking[0].pickup_location_id)
        dropoff = session.get(Location, booking[0].dropoff_location_id)
        bookings_public.append(BookingPublic(
            booking_id=booking[0].booking_id,
            pickup_address=pickup.address,
            dropoff_address=dropoff.address,
            pickup_city=pickup.city,
            dropoff_city=dropoff.city,
            estimated_price=booking[0].estimated_price,
        ))
    print("this count", count[0])
    return BookingsPublic(data=bookings_public, count=count[0])

@router.get("/my/", response_model=BookingsPublic)
def read_items(
    session: SessionDep, current_driver:CurrentDriver, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve bookings.
    """

    
    print(current_driver)
    count_statement = (
        select(func.count())
        .select_from(Booking)
        .where(Booking.driver_id == current_driver.driver_id)
    )
    count = session.exec(count_statement).one()
    statement = (
        select(Booking)
        .where(Booking.driver_id == current_driver.driver_id)
        .offset(skip)
        .limit(limit)
    )
    bookings = session.exec(statement).all()

    bookings_public = []
    
    
    for booking in bookings:
        pickup = session.get(Location, booking[0].pickup_location_id)
        dropoff = session.get(Location, booking[0].dropoff_location_id)
        bookings_public.append(BookingPublic(
            booking_id=booking[0].booking_id,
            pickup_address=pickup.address,
            dropoff_address=dropoff.address,
            pickup_city=pickup.city,
            dropoff_city=dropoff.city,
            estimated_price=booking[0].estimated_price,
        ))
    print("this count", count[0])
    return BookingsPublic(data=bookings_public, count=count[0])



@router.get("/{id}", response_model=BookingPublic)
def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get item by ID.
    """
    booking = session.get(Booking, id)
    if not booking:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (booking.owner_id != current_user.user_id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return booking





@router.post("/", response_model=BookingPublic)
async def create_booking(
    *, session: SessionDep, current_user: CurrentUser, booking_in: BookingCreate
) -> Any:
    """
    Create new booking with reverse geocoding for pickup and dropoff locations.
    """
    booking = BookingCreate.model_validate(booking_in)
    
    owner = session.get(User, current_user.user_id)
    # driver = session.get(Driver, booking.driver_id)

    # Process pickup location
    pickup_details = await get_location_details(booking.pickup_latitude, booking.pickup_longitude, settings.GEOAPIFY_API_KEY)
    pickup_location = Location(
        latitude=Decimal(str(booking.pickup_latitude)),
        longitude=Decimal(str(booking.pickup_longitude)),
        **pickup_details
    )
    session.add(pickup_location)

    # Process dropoff location
    dropoff_details = await get_location_details(booking.dropoff_latitude, booking.dropoff_longitude, settings.GEOAPIFY_API_KEY)
    dropoff_location = Location(
        latitude=Decimal(str(booking.dropoff_latitude)),
        longitude=Decimal(str(booking.dropoff_longitude)),
        **dropoff_details
    )
    session.add(dropoff_location)

    # Create the booking
    new_booking = Booking(
        owner_id=current_user.user_id,
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        estimated_price=booking.estimated_price,
        
        status="created",
        user=owner,
        # driver=driver
    )
    new_booking.vehicle = session.get(Item, booking.vehicle_id)

    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    return new_booking
