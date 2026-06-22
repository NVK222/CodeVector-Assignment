# CodeVector Assignment
This is the submission for the CodeVector internship assignment.  
This uses **FastAPI** backend with **Supabase**, using **Postgres** as the database.  
### The seed file is the **db/seed.sql** file. It uses CTE's for fast and efficient creation of 200000 rows of mock data.
# Usage
1. Clone this repository.
2. Run `uv sync`.
3. Make a .env file following the format of .env.example.
4. Run all the sql files in the db directory on your Supabase sql editor.
5. Run `uv run fastapi dev` to start up the server.
# Route
* GET `http://localhost:8000/api/items` with query parameters:
    
   ```
   skip: int (default = 0)  
   limit: int (default = 25)  
   category: str (default = None) (Can be one of Electronics, Groceries, Kitchen Appliances, Food, Pets, Fashion)
   sort_by: str (default = created_at) Sort by either created_at or updated_at
   ```
  > Example using Curl
  ```
  curl -X 'GET' \
  'http://localhost:8000/api/items?skip=0&limit=25&category=Electronics&sort_by=created_at' \
  -H 'accept: application/json'
  ```
# Performance
* Created 2 composite indexes, one for `(category, created_at)` and one for `(category, updated_at)`.
  #### This brought down **SELECT** queries from over **45ms -> 25ms**.
