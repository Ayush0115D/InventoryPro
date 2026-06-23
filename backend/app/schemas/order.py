from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime


VALID_TRANSITIONS = {
    "pending": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered", "cancelled"],
    "delivered": [],
    "cancelled": [],
    "completed": [],
}


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
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderDetailResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime | None = None
    customer_name: str
    product_name: str

    model_config = ConfigDict(from_attributes=True)


class StatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        valid = {"pending", "processing", "shipped", "delivered", "cancelled", "completed"}
        if v not in valid:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(sorted(valid))}")
        return v
