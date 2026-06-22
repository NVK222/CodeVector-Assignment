from pydantic import BaseModel


class Product(BaseModel):
    name: str
    category: str
    price: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes: True
