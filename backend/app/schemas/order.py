from pydantic import BaseModel, ConfigDict
from datetime import datetime


class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_amount: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderDetailResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_amount: float
    status: str
    created_at: datetime
    customer_name: str
    product_name: str

    model_config = ConfigDict(from_attributes=True)
