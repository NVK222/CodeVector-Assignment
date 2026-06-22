from typing import Annotated, Literal
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from codevector.api.schema import Product
from codevector.supabase_client import supabase

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://code-vector-assignment-pi.vercel.app",
    "https://code-vector-assignment-nvk222s-projects.vercel.app",
    "https://code-vector-assignment-git-main-nvk222s-projects.vercel.app",
    "https://code-vector-assignment-aefsqjr71-nvk222s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def check_health():
    return {"status": "ok"}


@app.get("/api/items", response_model=list[Product])
def get_products(
    limit: Annotated[int, Query(ge=1, le=1000)] = 25,
    category: Literal[
        "Electronics", "Groceries", "Kitchen Appliances", "Food", "Pets", "Fashion"
    ]
    | None = None,
    sort_by: Literal["updated_at", "created_at"] = "created_at",
    cursor: str | None = None,
):
    """
    Get paginated list of products with filtering
    Args:
        limit: int = Number of products to return
        category: str = A category from (Electronics, Groceries, Kitchen Appliances, Food, Pets, Fashion)
        sort_by: str = Sort by created_at or updated_at
        cursor: str = A postgres timestamp to filter by.
    Returns:
        A list of Product. (name, category, price, created_at, updated_at)
    """
    data = supabase.table("products").select("*")
    if category is not None:
        data = data.eq("category", category)
    if cursor is not None:
        data.lt(sort_by, cursor)
    data = data.order(sort_by, desc=True)
    data = data.limit(limit)
    data = data.execute().data
    return data
