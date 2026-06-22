# CodeVector Assignment
This is the submission for the CodeVector internship assignment.
# Usage
1. Clone this repository.
2. Run `uv sync`.
3. Make a .env file following the format of .env.example.
4. Run `uv run fastapi dev` to start up the server.
# Route
* GET `http://localhost:8000/api/items` with query parameters:  
      ```
      skip: int (default = 0)
      limit: int (default = 25)
      category: str (default = None) (Can be one of Electronics, Groceries, Kitchen Appliances, Food, Pets, Fashion)
      ```
  > Example using Curl
  ```
  curl -X 'GET' \
  'http://localhost:8000/api/items?skip=0&limit=25&category=Electronics' \
  -H 'accept: application/json'
  ```
      
