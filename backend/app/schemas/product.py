from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int


class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    price: float | None = None
    quantity: int | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int

    model_config = ConfigDict(from_attributes=True)
