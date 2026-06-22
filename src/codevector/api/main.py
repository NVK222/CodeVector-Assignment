from typing import Annotated, Literal
from fastapi import FastAPI, Query
from codevector.api.schema import Product
from codevector.supabase_client import supabase

app = FastAPI()


@app.get("/api/health")
async def check_health():
    return {"status": "ok"}


@app.get("/api/items", response_model=list[Product])
def get_products(
    skip: int = 0,
    limit: Annotated[int, Query(ge=1, le=1000)] = 25,
    category: Literal[
        "Electronics", "Groceries", "Kitchen Appliances", "Food", "Pets", "Fashion"
    ]
    | None = None,
):
    """
    Get paginated list of products with filtering
    Args:
        skip: int = Starting index of products
        limit: int = Number of products to return
        category: str = A category from (Electronics, Groceries, Kitchen Appliances, Food, Pets, Fashion)
    Returns:
        A list of Product. (name, category, price, created_at, updated_at)
    """
    data = supabase.table("products").select("*")
    if category is not None:
        data = data.eq("category", category)
    data = data.range(skip, skip + limit - 1).execute().data
    return data
