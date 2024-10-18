from datetime import timedelta
from typing import Annotated, Any
import uuid

from sqlalchemy import func, select

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import Booking, BookingCreate, BookingPublic, BookingsPublic, DistanceIn, Driver, Item, Location, Message, NewPassword, OneVehiclePriceEstimate, Token, User, UserPublic, VehiclePriceEstimates, VehicleType
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)

router = APIRouter()


@router.post("/price-estimates", response_model=VehiclePriceEstimates)
def read_items(
    *, session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, distance_in: DistanceIn
) -> VehiclePriceEstimates:
    """
    Retrieve items with price estimates.
    """
    count_statement = select(func.count()).select_from(VehicleType)
    count = session.exec(count_statement).one()
    
    statement = select(VehicleType).offset(skip).limit(limit)
    vehicleTypes = session.exec(statement).all()
    print(vehicleTypes[0][0].base_price)
    estimated_vehicles = []
    for vehicle in vehicleTypes:
        vehicle = vehicle[0]
        estimated_price = vehicle.base_price + (vehicle.price_per_km * distance_in.distance)
        estimated_vehicle = OneVehiclePriceEstimate(
            vehicle_type_id=vehicle.vehicle_type_id,
            name=vehicle.name,
            description=vehicle.description,
            base_price=vehicle.base_price,
            price_per_km=vehicle.price_per_km,
            capacity=vehicle.capacity,
            estimated_price=estimated_price
        )
        estimated_vehicles.append(estimated_vehicle)

    return VehiclePriceEstimates(vehicles=estimated_vehicles)
    
    for vehicleType in vehicleTypes:
        vehicleObj = VehicleType.model_validate(vehicleType)
        print(vehicleObj)
        vehicleType.price_estimate = vehicleType.price_per_km * distance_in.distance
        print(vehicleType.price_estimate)
            
    list_of_vehicle_types = [vehicleType for vehicleType in vehicleTypes]
    print(list_of_vehicle_types)

    return list_of_vehicle_types


# @router.get("/{id}", response_model=BookingPublic)
# def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
#     """
#     Get item by ID.
#     """
#     booking = session.get(Booking, id)
#     if not booking:
#         raise HTTPException(status_code=404, detail="Item not found")
#     if not current_user.is_superuser and (booking.owner_id != current_user.user_id):
#         raise HTTPException(status_code=400, detail="Not enough permissions")
#     return booking


# @router.post("/", response_model=BookingPublic)
# def create_item(
#     *, session: SessionDep, current_user: CurrentUser, booking_in: Booking
# ) -> Any:
#     """
#     Create new booking.
#     """
#     booking = Booking.model_validate(booking_in, update={"owner_id": current_user.user_id})
#     owner = session.get(User, current_user.user_id)
#     print(type(booking))
#     driver = session.get(Driver, booking.driver_id)
#     pickup_location = session.get(Location, booking.pickup_location_id)
#     dropoff_location = session.get(Location, booking.dropoff_location_id)
#     booking.driver = driver
#     booking.pickup_location = pickup_location
#     booking.dropoff_location = dropoff_location
#     booking.user = owner
#     session.add(booking)
#     session.commit()
#     session.refresh(booking)
#     return booking
