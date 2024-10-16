import datetime
from decimal import Decimal
from typing import Optional
import uuid

# from pydantic import EmailStr
# from sqlalchemy import JSON, Column, DateTime, func
# from sqlmodel import Field, Relationship, SQLModel


# # Shared properties
# class UserBase(SQLModel):
#     email: EmailStr = Field(unique=True, index=True, max_length=255)
#     is_active: bool = True
#     is_superuser: bool = False
#     full_name: str | None = Field(default=None, max_length=255)


# # Properties to receive via API on creation
# class UserCreate(UserBase):
#     password: str = Field(min_length=8, max_length=40)


# class UserRegister(SQLModel):
#     email: EmailStr = Field(max_length=255)
#     password: str = Field(min_length=8, max_length=40)
#     full_name: str | None = Field(default=None, max_length=255)


# # Properties to receive via API on update, all are optional
# class UserUpdate(UserBase):
#     email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
#     password: str | None = Field(default=None, min_length=8, max_length=40)


# class UserUpdateMe(SQLModel):
#     full_name: str | None = Field(default=None, max_length=255)
#     email: EmailStr | None = Field(default=None, max_length=255)


# class UpdatePassword(SQLModel):
#     current_password: str = Field(min_length=8, max_length=40)
#     new_password: str = Field(min_length=8, max_length=40)


# # Database model, database table inferred from class name
# class User(UserBase, table=True):
#     user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     hashed_password: str
#     items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
#     bookings: list["Booking"] = Relationship(back_populates="user")


# # Properties to return via API, user_id is always required
# class UserPublic(UserBase):
#     user_id: uuid.UUID


# class UsersPublic(SQLModel):
#     data: list[UserPublic]
#     count: int


# # Shared properties
# class ItemBase(SQLModel):
#     title: str = Field(min_length=1, max_length=255)
#     description: str | None = Field(default=None, max_length=255)


# # Properties to receive on item creation
# class ItemCreate(ItemBase):
#     pass


# # Properties to receive on item update
# class ItemUpdate(ItemBase):
#     title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# # Database model, database table inferred from class name
# class Item(ItemBase, table=True):
#     user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     title: str = Field(max_length=255)
#     owner_id: uuid.UUID = Field(
#         foreign_key="user.user_id", nullable=False, ondelete="CASCADE"
#     )
#     owner: User | None = Relationship(back_populates="items")


# # Properties to return via API, user_id is always required
# class ItemPublic(ItemBase):
#     user_id: uuid.UUID
#     owner_id: uuid.UUID


# class ItemsPublic(SQLModel):
#     data: list[ItemPublic]
#     count: int


# # Generic message
# class Message(SQLModel):
#     message: str


# # JSON payload containing access token
# class Token(SQLModel):
#     access_token: str
#     token_type: str = "bearer"


# # Contents of JWT token
# class TokenPayload(SQLModel):
#     sub: str | None = None


# class NewPassword(SQLModel):
#     token: str
#     new_password: str = Field(min_length=8, max_length=40)
    
    
    
# class Driver(SQLModel, table=True):
#     driver_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     name: str = Field(max_length=255)
#     email: EmailStr = Field(unique=True, index=True, max_length=255)
#     phone_number: str = Field(max_length=20)
#     password_hash: str
#     license_number: str = Field(max_length=50)
#     vehicle_type: str = Field(max_length=50)
#     is_active: bool = Field(default=True)
#     created_at: datetime.datetime = Field(
#         default_factory=datetime.datetime.utcnow,
#     )
#     updated_at: Optional[datetime.datetime] = Field(
#         sa_column=Column(DateTime(), onupdate=func.now())
# )
#     bookings: list["Booking"] = Relationship(back_populates="driver")
#     vehicle_id: uuid.UUID = Field(foreign_key="vehicle.vehicle_id")
#     vehicle: "Vehicle" = Relationship(back_populates="drivers")
#     vehicle_type_id: uuid.UUID = Field(foreign_key="vehicletype.vehicle_type_id")
#     assigned_vehicle_type: "VehicleType" = Relationship(back_populates="drivers")

# # Vehicle model
# class Vehicle(SQLModel, table=True):
#     vehicle_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     plate_number: str = Field(max_length=20)
#     make: str = Field(max_length=50)
#     model: str = Field(max_length=50)
#     year: int
#     vehicle_type: str = Field(max_length=50)
#     is_active: bool = Field(default=True)
#     created_at: datetime.datetime = Field(
#         default_factory=datetime.datetime.utcnow,
#     )
#     updated_at: Optional[datetime.datetime] = Field(
#         sa_column=Column(DateTime(), onupdate=func.now())
# )
#     drivers: list[Driver] = Relationship(back_populates="vehicle")

# # Booking model
# class Booking(SQLModel, table=True):
#     booking_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     user_id: uuid.UUID = Field(foreign_key="user.user_id")
#     driver_id: uuid.UUID = Field(foreign_key="driver.driver_id")
#     pickup_location_id: uuid.UUID = Field(foreign_key="location.location_id")
#     dropoff_location_id: uuid.UUID = Field(foreign_key="location.location_id")
#     booking_time: datetime.datetime
#     pickup_time: datetime.datetime
#     dropoff_time: datetime.datetime
#     estimated_price: Decimal = Field(max_digits=10, decimal_places=2)
#     final_price: Decimal = Field(max_digits=10, decimal_places=2)
#     status: str = Field(max_length=20)
#     created_at: datetime.datetime = Field(
#         default_factory=datetime.datetime.utcnow,
#     )
#     updated_at: Optional[datetime.datetime] = Field(
#         sa_column=Column(DateTime(), onupdate=func.now())
# )
#     user: User = Relationship(back_populates="bookings")
#     driver: Driver = Relationship(back_populates="bookings")
#     pickup_location: "Location" = Relationship(sa_relationship_kwargs={"foreign_keys": [pickup_location_id]})
#     dropoff_location: "Location" = Relationship(sa_relationship_kwargs={"foreign_keys": [dropoff_location_id]})
#     tracking: "Tracking" = Relationship(back_populates="booking")
#     payment: "Payment" = Relationship(back_populates="booking")

# # Location model
# class Location(SQLModel, table=True):
#     location_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     latitude: Decimal = Field(max_digits=9, decimal_places=6)
#     longitude: Decimal = Field(max_digits=9, decimal_places=6)
#     address: str = Field(max_length=255)
#     city: str = Field(max_length=100)
#     state: str = Field(max_length=100)
#     country: str = Field(max_length=100)
#     postal_code: str = Field(max_length=20)
#     pickup_bookings: list["Booking"] = Relationship(back_populates="pickup_location", sa_relationship_kwargs={"foreign_keys": "[Booking.pickup_location_id]"})
#     dropoff_bookings: list["Booking"] = Relationship(back_populates="dropoff_location", sa_relationship_kwargs={"foreign_keys": "[Booking.dropoff_location_id]"})


# # Tracking model
# class Tracking(SQLModel, table=True):
#     tracking_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     booking_id: uuid.UUID = Field(foreign_key="booking.booking_id")
#     latitude: Decimal = Field(max_digits=9, decimal_places=6)
#     longitude: Decimal = Field(max_digits=9, decimal_places=6)
#     timestamp: datetime.datetime
#     booking: Booking = Relationship(back_populates="tracking")

# # Payment model
# class Payment(SQLModel, table=True):
#     payment_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     booking_id: uuid.UUID = Field(foreign_key="booking.booking_id")
#     amount: Decimal = Field(max_digits=10, decimal_places=2)
#     payment_method: str = Field(max_length=50)
#     status: str = Field(max_length=20)
#     payment_time: datetime.datetime
#     booking: Booking = Relationship(back_populates="payment")

# # VehicleType model
# class VehicleType(SQLModel, table=True):
#     vehicle_type_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     name: str = Field(max_length=50)
#     description: str = Field(max_length=255)
#     base_price: Decimal = Field(max_digits=10, decimal_places=2)
#     price_per_km: Decimal = Field(max_digits=10, decimal_places=2)
#     capacity: int
#     drivers: list[Driver] = Relationship(back_populates="assigned_vehicle_type")

# # PricingRule model
# class PricingRule(SQLModel, table=True):
#     rule_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     rule_type: str = Field(max_length=50)
#     effective_from: datetime.datetime
#     effective_to: datetime.datetime

# # Admin model
# class Admin(SQLModel, table=True):
#     admin_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     name: str = Field(max_length=255)
#     email: EmailStr = Field(unique=True, index=True, max_length=255)
#     password_hash: str
#     role: str = Field(max_length=50)
#     created_at: datetime.datetime = Field(
#         default_factory=datetime.datetime.utcnow,
#     )
#     updated_at: Optional[datetime.datetime] = Field(
#         sa_column=Column(DateTime(), onupdate=func.now())
# )


from pydantic import EmailStr
from sqlalchemy import Column, DateTime, ForeignKey, Numeric, func
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=20)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    bookings: list["Booking"] = Relationship(back_populates="user")


# Properties to return via API, user_id is always required
class UserPublic(UserBase):
    user_id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    
class BookingBase(SQLModel):
    pass


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass

class BookingCreate(BookingBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.user_id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, user_id is always required
class ItemPublic(ItemBase):
    user_id: uuid.UUID
    owner_id: uuid.UUID
    
class BookingPublic(BookingBase):
    booking_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int
    
class BookingsPublic(SQLModel):
    data: list[BookingPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
    
    
class VehicleType(SQLModel, table=True):
    vehicle_type_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=50)
    description: str = Field(max_length=255)
    base_price: Decimal = Field(max_digits=10, decimal_places=2)
    price_per_km: Decimal = Field(max_digits=10, decimal_places=2)
    capacity: int
    drivers: list["Driver"] = Relationship(back_populates="vehicle_type")
    
class Driver(UserBase, table=True):
    driver_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    vehicle_type_id: Optional[uuid.UUID] = Field(default=None, foreign_key="vehicletype.vehicle_type_id")
    license_number: str = Field(max_length=50)
    hashed_password: str
    vehicle_type: Optional[VehicleType] = Relationship(back_populates="drivers")
    bookings: list["Booking"] = Relationship(back_populates="driver")
    
class Location(SQLModel, table=True):
    location_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    latitude: Decimal = Field(max_digits=9, decimal_places=6)
    longitude: Decimal = Field(max_digits=9, decimal_places=6)
    address: str = Field(max_length=255)
    city: str = Field(max_length=100)
    state: str = Field(max_length=100)
    country: str = Field(max_length=100)
    postal_code: str = Field(max_length=20)
    pickup_bookings: list["Booking"] = Relationship(back_populates="pickup_location", sa_relationship_kwargs={'foreign_keys': '[Booking.pickup_location_id]'})
    dropoff_bookings: list["Booking"] = Relationship(back_populates="dropoff_location", sa_relationship_kwargs={'foreign_keys': '[Booking.dropoff_location_id]'})    
    
class Payment(SQLModel, table=True):
    payment_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID = Field(sa_column=Column(ForeignKey("booking.booking_id"), unique=True))
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    payment_method: str = Field(max_length=50)
    status: str = Field(max_length=20)
    payment_time: datetime.datetime = Field(
        default_factory=datetime.datetime.utcnow,
    )
    booking: "Booking" = Relationship(back_populates="payment")
    
class Booking(SQLModel, table=True):
    booking_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.user_id")
    driver_id: uuid.UUID = Field(foreign_key="driver.driver_id")
    pickup_location_id: uuid.UUID = Field(foreign_key="location.location_id")
    dropoff_location_id: uuid.UUID = Field(foreign_key="location.location_id")
    booking_time: datetime.datetime
    pickup_time: datetime.datetime
    dropoff_time: datetime.datetime
    estimated_price: Decimal = Field(sa_column=Column(Numeric(10, 2)))
    final_price: Decimal = Field(sa_column=Column(Numeric(10, 2)))
    status: str = Field(max_length=20)
    created_at: datetime.datetime = Field(
        default_factory=datetime.datetime.utcnow,
    )
    updated_at: Optional[datetime.datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )
    user: User = Relationship(back_populates="bookings")
    driver: Driver = Relationship(back_populates="bookings")
    pickup_location: "Location" = Relationship(back_populates="pickup_bookings", sa_relationship_kwargs={'foreign_keys': '[Booking.pickup_location_id]'})
    dropoff_location: "Location" = Relationship(back_populates="dropoff_bookings", sa_relationship_kwargs={'foreign_keys': '[Booking.dropoff_location_id]'})    # tracking: Tracking = Relationship(back_populates="booking") # time series data
    payment: Optional["Payment"] = Relationship(back_populates="booking")    
