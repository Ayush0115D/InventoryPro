from pydantic import BaseModel, ConfigDict


class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    model_config = ConfigDict(from_attributes=True)
