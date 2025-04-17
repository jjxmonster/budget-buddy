# Expense View Implementation Plan

## 1. Overview
This view is used for managing expenses, allowing users to add, edit, and delete expenses. Users can view the expense list, use filtering and sorting tools, and perform CRUD operations through an intuitive interface.

## 2. View Routing
The view should be accessible under the `/dashboard` path.

## 3. Component Structure
- **DashboardExpenseView** (main view component)
  - **ExpenseTable** (displays the list of expenses)
    - **ExpenseRow** (a single table row representing an expense)
    - **FilterComponent** (optional, for filtering and sorting)
  - **ExpenseFormModal** (modal for adding/editing an expense)
  - **ConfirmationModal** (modal for confirming expense deletion)

## 4. Component Details
### DashboardExpenseView
- Description: The main dashboard view for managing expenses, integrating the expense table and operational modals.
- Elements: A container with the expense table, an "Add Expense" button, and modal visibility management.
- Supported Interactions: Opening/closing modals, refreshing the list after CRUD operations.
- Types: Uses `ExpenseDTO` for the expense list.
- Props: None; this is a page-level component.

### ExpenseTable
- Description: Component that displays the list of expenses in a table format with columns: title, date, amount, category, source, actions.
- Elements: Table headers, dynamic rows (`ExpenseRow`), edit and delete buttons.
- Supported Interactions: Clicking edit and delete buttons, filtering, sorting, and pagination.
- Validation: Data is verified based on types (e.g., text length constraints are enforced in the form, ensuring data correctness).
- Types: `ExpenseDTO`, pagination types (e.g., `ExpenseListResponse`).
- Props: `expenses`, `onEdit(expense)`, `onDelete(expense)`.

### ExpenseFormModal
- Description: A modal that allows the user to add or edit an expense.
- Elements: A form with the following fields:
  - Title (input, max 50 characters, required)
  - Description (textarea, optional, max 200 characters)
  - Date (date picker, required)
  - Amount (numeric input, dollars only, required)
  - Category (select from a predefined list)
  - Source (select from a predefined list)
- Supported Interactions: Changing field values, submitting the form, closing the modal.
- Validation Conditions:
  - Title: required, maximum 50 characters
  - Description: if provided, maximum 200 characters
  - Date: must be in a valid ISO format
  - Amount: must be a number
- Types: A new type `ExpenseFormValues`:
  ```typescript
  interface ExpenseFormValues {
    title: string;
    description?: string;
    date: string;
    amount: number;
    category_id?: number;
    source_id?: number;
  }
  ```
- Props: `open` (boolean), `mode` ('add' | 'edit'), `defaultValues` (either an ExpenseDTO or ExpenseFormValues for editing), `onClose`, `onSubmit`.

### ConfirmationModal
- Description: A modal that displays a confirmation message before deleting an expense.
- Elements: A message, and "Yes" (confirm) and "No" (cancel) buttons.
- Supported Interactions: Confirming deletion or canceling the action.
- Types: Simple modal interface.
- Props: `open` (boolean), `message` (string), `onConfirm`, `onCancel`.

### FilterComponent
- Description: A component that enables filtering and sorting of the expense list.
- Elements: Date pickers, an input or slider for the amount range, and selectors for categories and sources.
- Supported Interactions: Changing filter parameters and triggering a data update.
- Validation Conditions: Correct date format and numerical values for the amount range.
- Types: A filter interface, for example:
  ```typescript
  interface ExpenseFilter {
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
    category_id?: number;
    source_id?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }
  ```
- Props: `onFilterChange(filterParams: ExpenseFilter)`.

## 5. Types
- `ExpenseDTO`: Defined in `types/types.ts`.
- `CreateExpenseCommand` / `UpdateExpenseCommand`: Used for adding and editing operations.
- `ExpenseFormValues`: A new type representing form data (fields: title, description, date, amount, category_id, source_id).
- `ExpenseListResponse`: Response type from the GET /expenses endpoint, containing the list of expenses and pagination metadata.

## 6. State Management
- Using hooks:
  - For fetching the expense list: we will use the `useQuery` hook from react-query to manage loading state and error handling when fetching data.
  - For managing the visibility of modals (ExpenseFormModal, ConfirmationModal) – using `useState` or context.
  - For storing the currently selected expense for editing or deletion – using `useState`.
  - For storing filter parameters – using `useState`.

## 7. API Integration
- **GET /expenses**: Fetches the list of expenses, supporting filtering, pagination, and sorting parameters.
- **POST /expenses**: Adds a new expense. The data is sent according to `CreateExpenseCommand` and `ExpenseFormValues`.
- **PUT /expenses/:id**: Updates an existing expense. The data conforms to `UpdateExpenseCommand`.
- **DELETE /expenses/:id**: Deletes an expense.
- Request and response types adhere to the API documentation and the types defined in `types/types.ts`.
- **Data Prefetching**: On the server side (page.tsx) for the `/dashboard` route, we use the `prefetchQuery` function from react-query to prefetch data from the GET /expenses endpoint before rendering the view.

## 8. User Interactions
- Clicking the "Add Expense" button opens the `ExpenseFormModal` in add mode.
- Filling out the form and submitting it triggers an API call (POST or PUT) and refreshes the expense table.
- Clicking the "Edit" button on a row opens the `ExpenseFormModal` with prepopulated expense data.
- Clicking the "Delete" button opens the `ConfirmationModal`; confirming triggers a DELETE request and updates the list.
- Changing values in the `FilterComponent` re-fetches data using the new filter parameters.

## 9. Conditions and Validation
- **ExpenseFormModal**:
  - Title: required, maximum of 50 characters.
  - Description: optional, maximum of 200 characters.
  - Date: must be in a valid ISO string format.
  - Amount: must be a number.
- **Filtering**:
  - Validation of date format and numerical values for the amount range.
- API responses are verified for status codes (e.g., 400, 422) with appropriate error handling.

## 10. Error Handling
- Display error messages (using toast notifications or alerts) in case of API call failures.
- Inline error messages for form validation.
- Handle specific API response errors (e.g., 401, 404, 500) with proper user feedback.

## 11. Implementation Steps
1. Create the main component `DashboardExpenseView` and integrate it into the dashboard layout.
2. Implement the `ExpenseTable` component to fetch and display the list of expenses, including pagination, filtering, and sorting mechanisms.
3. Develop the `ExpenseFormModal` component with the expense form, including field validation and submission logic.
4. Implement the `ConfirmationModal` component for confirming expense deletion.
5. (Optional) Create the `FilterComponent` and integrate it with `ExpenseTable` for filtering functionality.
6. Connect API calls (GET, POST, PUT, DELETE) with the appropriate request types and response handling.
7. Manage state using hooks (`useState`) and, optionally, custom hooks or react-query.
8. Implement error handling, loading states, and display appropriate notifications to the user.
9. Test user interactions – adding, editing, and deleting expenses.
10. Refactor and document the code according to best practices. 