# CodeVector Assignment
This is the submission for the CodeVector internship assignment.  
This uses **FastAPI** backend with **Supabase**, using **Postgres** as the database.  
## The seed file is the **db/seed.sql** file. It uses CTE's for fast and efficient creation of 200000 rows of mock data.
> ## Note:
> The render backend takes a while to start up for the first time.

## Live Link: https://code-vector-assignment-pi.vercel.app/  

# Prerequisites  
1. uv.
2. pnpm with node installed.  
  
# Usage
1. Clone this repository.
2. Run `uv sync`.
3. Make a .env file following the format of .env.example.
4. Run all the sql files in the db directory on your Supabase sql editor.
5. Run `uv run fastapi dev` to start up the server.
6. Move to `ui` and run `pnpm install`, `pnpm dev` to start up the frontend
# Route
* GET `http://localhost:8000/api/items` with query parameters:
   ```
   limit: int (default = 25)  
   category: str (default = None) (Can be one of Electronics, Groceries, Kitchen Appliances, Food, Pets, Fashion)
   sort_by: str (default = created_at) Sort by either created_at or updated_at
   cursor: str (default = None)
   ```
  > Example using Curl
  ```
  curl -X 'GET' \
  'http://localhost:8000/api/items?limit=25&category=Electronics&sort_by=created_at&cursor=2025-12-28T13%3A27%3A17' \
  -H 'accept: application/json'
  ```
# Features
* Created 2 indexes `created_at` and `updated_at`.
  ### This brought down **SELECT** queries without filtering from over 150ms &rarr; 70ms
* Created 2 composite indexes, one for `(category, created_at)` and one for `(category, updated_at)`.
  ### This brought down **SELECT** queries filtering categories from over **45ms &rarr; 25ms**.
* Use cursor based pagination to avoid pagination drift.

