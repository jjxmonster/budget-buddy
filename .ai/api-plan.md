# REST API Plan

## 1. Resources

- **Expense** (maps to the `expenses` table): Represents a user's expense entry with fields for title, description, category, source, date, and amount. Validations include maximum lengths for title (50 chars) and description (200 chars), and proper currency format for amount.
- **Category** (maps to the `categories` table): Represents a category for expenses, with a `name` field (max 40 characters).
- **Source** (maps to the `sources` table): Represents the source of an expense, with a `name` field (max 40 characters).
- **User** (maps to the `users` table): Stores user authentication data such as email and password hash. Each user owns their expenses, categories, and sources.
- **Feedback** (maps to an `ai_feedback` table): Captures user feedback on AI assistant responses with fields to record whether the information was helpful.
- **AI Query**: Represents the request to the AI assistant for answering financial queries. This endpoint interfaces with an external AI service (Openrouter.ai) and is not directly tied to a persistent table.

## 2. Endpoints

### Expense Endpoints

1. **GET /expenses**

   - Description: Retrieve a paginated list of expenses for the authenticated user.
   - Query Parameters:
     - `page` (number): Page number for pagination.
     - `pageSize` (number): Number of records per page.
     - `date_from` and `date_to` (ISO date strings): Filter expenses within a date range.
     - `category_id` (string/number): Filter by category.
     - `source_id` (string/number): Filter by source.
     - `amount_min` and `amount_max` (numbers): Filter by expense amount range.
     - `sort_by` (string): Field to sort by (e.g., date or amount).
     - `order` (string): Sort order (asc or desc).
   - Response:
     - Success (200): JSON array of expense objects along with pagination metadata.
     - Errors: 401 Unauthorized, 500 Internal Server Error.

2. **GET /expenses/:id**

   - Description: Retrieve the details of a single expense.
   - Path Parameter: Expense `id`.
   - Response:
     - Success (200): JSON expense object.
     - Errors: 401 Unauthorized, 404 Not Found.

3. **POST /expenses**

   - Description: Create a new expense.
   - Request Body (JSON):
     ```json
     {
     	"title": "Lunch",
     	"description": "Business lunch meeting",
     	"date": "2023-10-15",
     	"amount": 25.5,
     	"category_id": "cat123",
     	"source_id": "src456"
     }
     ```
   - Validations: Title max 50 characters; Description max 200 characters; proper formats for date and amount.
   - Response:
     - Success (201): JSON object with created expense details.
     - Errors: 400 Bad Request, 401 Unauthorized, 422 Unprocessable Entity.

4. **PUT /expenses/:id**

   - Description: Update an existing expense.
   - Request Body (JSON): Similar to POST /expenses.
   - Response:
     - Success (200): JSON object with updated expense details.
     - Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found.

5. **DELETE /expenses/:id**
   - Description: Delete an expense.
   - Response:
     - Success (204): No content.
     - Errors: 401 Unauthorized, 404 Not Found.

### Category Endpoints

1. **GET /categories**

   - Description: List all categories available to the user.
   - Response:
     - Success (200): JSON array of category objects.
     - Errors: 401 Unauthorized, 500 Internal Server Error.

2. **GET /categories/:id**

   - Description: Retrieve details of a specific category.
   - Response:
     - Success (200): JSON category object.
     - Errors: 401 Unauthorized, 404 Not Found.

3. **POST /categories**

   - Description: Create a new category.
   - Request Body:
     ```json
     {
     	"name": "Food"
     }
     ```
   - Validation: Name max 40 characters.
   - Response:
     - Success (201): JSON category object.
     - Errors: 400 Bad Request, 401 Unauthorized.

4. **PUT /categories/:id**

   - Description: Update a category.
   - Request Body: Similar to POST.
   - Response:
     - Success (200): JSON category object.
     - Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found.

5. **DELETE /categories/:id**
   - Description: Delete a category.
   - Response:
     - Success (204): No content.
     - Errors: 401 Unauthorized, 404 Not Found.

### Source Endpoints

1. **GET /sources**

   - Description: List all sources.
   - Response:
     - Success (200): JSON array of source objects.
     - Errors: 401 Unauthorized, 500 Internal Server Error.

2. **GET /sources/:id**

   - Description: Retrieve details of a specific source.
   - Response:
     - Success (200): JSON source object.
     - Errors: 401 Unauthorized, 404 Not Found.

3. **POST /sources**

   - Description: Create a new source.
   - Request Body:
     ```json
     {
     	"name": "Credit Card"
     }
     ```
   - Validation: Name max 40 characters.
   - Response:
     - Success (201): JSON source object.
     - Errors: 400 Bad Request, 401 Unauthorized.

4. **PUT /sources/:id**

   - Description: Update a source.
   - Request Body: Similar to POST.
   - Response:
     - Success (200): JSON source object.
     - Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found.

5. **DELETE /sources/:id**
   - Description: Delete a source.
   - Response:
     - Success (204): No content.
     - Errors: 401 Unauthorized, 404 Not Found.

### Feedback Endpoints

1. **POST /feedback**
   - Description: Submit feedback on an AI assistant response.
   - Request Body:
     ```json
     {
     	"query_id": "ai_query_123",
     	"wasHelpful": true
     }
     ```
   - Response:
     - Success (201): JSON object with recorded feedback details.
     - Errors: 400 Bad Request, 401 Unauthorized.

### AI Assistant Endpoint

1. **POST /ai/query**
   - Description: Submit a question/query to the AI assistant regarding expense information.
   - Request Body:
     ```json
     {
     	"question": "How much did I spend last week?"
     }
     ```
   - Response:
     - Success (200): JSON object containing the AI-generated answer.
     - Errors: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error.
   - Note: This endpoint integrates with an external AI service (via Openrouter.ai) and may implement request throttling or rate limiting as needed.

## 3. Validation and Business Logic

- **Input Validation:**
  - Expense: Title is required and must not exceed 50 characters; Description (if provided) must not exceed 200 characters; Date must be a valid ISO date; Amount must conform to currency formats.
  - Category and Source: The `name` field must not exceed 40 characters.
  - Authentication: Email format is validated, and password complexity is enforced.
- **Business Logic:**
  - Filtering and sorting are handled on the GET /expenses endpoint using query parameters (e.g., date ranges, category, source, amount ranges).
  - User authorization ensures that users can only retrieve or modify their own expense, category, and source entries.
  - The AI Query endpoint processes natural language questions using an external AI service and returns contextually relevant financial insights.
  - Feedback for the AI assistant is recorded immediately after an answer is generated, allowing for iterative improvements based on user input.
- **Error Handling:**
  - Standardized HTTP status codes are used (e.g., 400 for bad requests, 401 for unauthorized access, 404 for not found, 500 for internal server errors).
  - Error responses include descriptive messages to aid client-side debugging.
- **Performance Considerations:**
  - List retrieval endpoints implement pagination to manage large datasets efficiently.
  - Indexes on critical columns (e.g., date, user_id, amount) are assumed to be in place to optimize query performance.
  - Rate limiting and throttling may be applied on high-load endpoints (e.g., /ai/query) to ensure system stability.
