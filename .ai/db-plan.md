## Database Schema Documentation

### 1. List of Tables, Columns, Data Types, and Constraints

#### a) Users Table

_Note:_ The `Users` table is managed by Supabase and contains the following columns:

- `id`
- `email`
- `created_at`
- `encrypted_password`
- `confirmed_at`

---

#### b) Expense Table

Stores expense information linked to a user, category, and source.

- `id` – PRIMARY KEY (e.g., of type SERIAL or UUID, depending on the implementation)
- `user_id` – REFERENCES Users(id) NOT NULL
- `title` – VARCHAR(50) NOT NULL
- `description` – VARCHAR(200) (optional field)
- `date` – DATE NOT NULL
- `amount` – NUMERIC(10,2) NOT NULL
- `category_id` – INTEGER REFERENCES Category(id) ON DELETE SET NULL (optional)
- `source_id` – INTEGER REFERENCES Source(id) ON DELETE SET NULL (optional)
- `created_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

#### c) Category Table

Stores expense categories. To enable the use of RLS (row-level security) so that users can access only their own data, this table should include a column identifying the owner.

- `id` – PRIMARY KEY (e.g., SERIAL)
- `user_id` – REFERENCES Users(id) NOT NULL
- `name` – VARCHAR(40) NOT NULL
- `created_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

#### d) Source Table

Stores expense sources – similar to categories, they are assigned to a specific user:

- `id` – PRIMARY KEY (e.g., SERIAL)
- `user_id` – REFERENCES Users(id) NOT NULL
- `name` – VARCHAR(40) NOT NULL
- `created_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

#### e) Feedback Table

Dedicated to interactions with the AI assistant – stores questions, answers, and ratings of the provided responses.

- `id` – PRIMARY KEY (e.g., SERIAL)
- `question` – TEXT NOT NULL
- `answer` – TEXT NOT NULL
- `rating` – INTEGER NOT NULL
- `created_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` – TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

### 2. Relationships Between Tables

- In the `Expense` table:
  • `user_id` refers to `Users.id`
  • `category_id` refers to `Category.id` (when a Category record is deleted, the column is set to NULL)
  • `source_id` refers to `Source.id` (when a Source record is deleted, the column is set to NULL)

- In the `Category` and `Source` tables:
  • The `user_id` column specifies which user owns the categories/sources (enabling RLS)

---

### 3. Indexes

To optimize query performance (when filtering and searching), it is recommended to implement the following indexes:

- On the `Expense` table:
  • Index on the `user_id` column
  • Index on the `date` column
  • Index on the `category_id` column
  • Index on the `source_id` column
  • Index on the `amount` column

---

### 4. PostgreSQL Policies (RLS – Row-Level Security)

To ensure that each user has access only to their own data, RLS should be enabled on the `Expense`, `Category`, and `Source` tables. An example configuration for the `Expense` table might look as follows:

```sql
ALTER TABLE Expense ENABLE ROW LEVEL SECURITY;

CREATE POLICY expense_rls_policy ON Expense
  USING (user_id = current_setting('jwt.claims.user_id')::uuid);
```

Similar RLS policies should be set up for the `Category` and `Source` tables. It is advisable to adjust the use of functions like `current_setting('jwt.claims.user_id')` to match how the user identifier is passed in your environment (e.g., the default Supabase configuration).

---

### 5. Additional Notes and Explanations

- In the `Expense` table, the `category_id` and `source_id` columns are optional – when the corresponding record in the `Category` or `Source` tables is deleted, the value is set to NULL, preventing unwanted cascading deletions.
- All tables (except for the Supabase-managed `Users` table) include audit columns (`created_at` and `updated_at`), which allow tracking changes.
- Using the type `NUMERIC(10,2)` for the `amount` field ensures the storage of monetary values with precision up to two decimal places.
- The schema is designed with Third Normal Form (3NF) in mind, ensuring proper data normalization and scalability.
- The implementation of indexes on critical columns (facilitating filtering queries) ensures high efficiency in search operations.
- The configuration of RLS secures the data by limiting visibility of records solely to the owner (`user_id`).

---
