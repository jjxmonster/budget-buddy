# Product Requirements Document (PRD) - BudgetBuddy

## 1. Product Overview

BudgetBuddy is an application that allows users to manually input and manage their expenses. The app offers an intuitive interface that enables adding, editing, and deleting expenses, as well as filtering and sorting data on the dashboard. Additionally, the AI assistant answers questions regarding expense history, supporting users in analyzing their finances. The product is designed with responsiveness in mind, making it accessible on both mobile and desktop devices.

## 2. User Problem

Users often have difficulty tracking their expenses and analyzing financial data. There is a lack of a tool that easily allows recording expenses and obtaining quick answers to questions about financial history. Users need an intuitive system that enables efficient management of financial records without unnecessary complications, while ensuring data security.

## 3. Functional Requirements

- Expense Management
  - Adding a new expense with the following fields: title (max. 50 characters), description (optional, max. 200 characters), category (optional), source (optional), date (date picker), and amount (currency: dollar, fixed).
  - Editing existing expenses while adhering to validation rules.
  - Deleting expenses with a confirmation dialog.
- Category Management
  - Adding, editing, and deleting categories.
  - The category creation form contains only the "Name" field (max. 40 characters).
- Source Management
  - Adding, editing, and deleting sources.
  - The source creation form contains only the "Name" field (max. 40 characters).
- Dashboard
  - Displaying the list of expenses.
  - Filtering expenses by: date, category, source, and amount range.
  - Sorting expenses by date or amount.
- AI Assistant
  - Answering user questions about expense history (e.g., "How much money did I spend last week?").
- Feedback System
  - Collecting user feedback on the usefulness of the AI assistant's response by asking, "Was this information helpful?"
  - Recording the feedback results in a dedicated table.
- Data Validation
  - Expense title: maximum of 50 characters.
  - Expense description: maximum of 200 characters.
  - "Name" field for categories and sources: maximum of 40 characters.

## 4. Product Boundaries

- No integration with external systems (e.g., banks, accounting systems).
- Support for only one currency – the dollar (without the option to choose or change).
- The product does not include advanced financial analysis or expense forecasting.

## 5. User Stories

1. ID: US-001  
   Title: Adding a New Expense  
   Description: As a user, I want to add a new expense to track my spending. The form includes fields for title, description, category, source, date, and amount.  
   Acceptance Criteria:

   - The form allows entering a title (max. 50 characters).
   - The optional description field accepts up to 200 characters.
   - The user selects a category and source from pre-created lists.
   - The date is selected using a date picker.
   - The amount is expressed in dollars and the currency cannot be changed.
   - After saving, the expense appears on the dashboard.

2. ID: US-002  
   Title: Editing an Expense  
   Description: As a user, I want to edit an existing expense to correct or update the entered data.  
   Acceptance Criteria:

   - Ability to edit all fields of the expense.
   - Changes are validated according to the rules (e.g., title of 50 characters, description of 200 characters).
   - The updated expense is displayed on the dashboard.

3. ID: US-003  
   Title: Deleting an Expense  
   Description: As a user, I want to delete an expense to remove outdated or incorrect entries.  
   Acceptance Criteria:

   - A delete button is available for each expense.
   - A confirmation dialog is displayed before deletion.
   - After confirmation, the expense is removed and no longer displayed on the dashboard.

4. ID: US-004  
   Title: Managing Categories  
   Description: As a user, I want to add, edit, and delete categories to better organize my expenses.  
   Acceptance Criteria:

   - Ability to add a new category with a name up to 40 characters.
   - Editing existing categories follows validation rules.
   - Deleting a category removes it from the selection options in expense entries.

5. ID: US-005  
   Title: Managing Sources  
   Description: As a user, I want to create, edit, and delete sources so that I can categorize the origin of my expenses.  
   Acceptance Criteria:

   - Ability to add a source with a name up to 40 characters.
   - Editing and deleting a source updates the list of available options when entering expenses.

6. ID: US-006  
   Title: Filtering and Sorting Expenses  
   Description: As a user, I want to filter and sort expenses by date, category, source, and amount range, so that I can quickly find the data I need.  
   Acceptance Criteria:

   - The dashboard allows filtering expenses by: date, category, source, and amount range.
   - The user can sort the results by date or amount.
   - The results are dynamically updated after applying filters or sorting.

7. ID: US-007  
   Title: Interacting with the AI Assistant  
   Description: As a user, I want to ask the AI assistant questions about expense history to get a quick financial summary.  
   Acceptance Criteria:

   - The user can enter a question in the AI assistant interface.
   - The AI assistant provides answers based on historical expense data.
   - The answer is displayed in a clear format.

8. ID: US-008  
   Title: AI Assistant Feedback System  
   Description: As a user, I want to rate the usefulness of the AI assistant's response so that the system can collect feedback on the quality of the answers.  
   Acceptance Criteria:

   - After providing the answer, the question "Was this information helpful?" is displayed.
   - The user can provide feedback, which is recorded in a dedicated table.
   - The feedback data can be analyzed to improve the AI assistant's accuracy.

9. ID: US-009  
   Title: Authentication and Secure Access  
   Description: As a user, I want to log into the system to ensure secure access to my data.  
   Acceptance Criteria:

   - The system requires logging in with unique credentials (e.g., email and password).
   - After logging in, the user has access only to their own data.
   - The login process is secure.

10. ID: US-010  
    Title: User Registration  
    Description: As a new user, I want to register in the system to gain personalized access to my data.  
    Acceptance Criteria:
    - The registration form includes fields for email, password, and password confirmation.
    - The email must be in the correct format.
    - The password must meet minimum complexity requirements (e.g., minimum length, combination of letters and numbers).
    - The password confirmation must match the password.
    - After successful registration, the user is automatically logged in or redirected to the login page.
    - Optional email verification as an additional step to confirm registration.

## 6. Success Metrics

- The accuracy of the AI assistant's responses measured through user feedback, with the goal of achieving at least 75% positive ratings.
- The intuitiveness and responsiveness of the user interface, measured through usability studies and interaction times.
- The effectiveness of the filtering and sorting functionality, assessed based on the accuracy of displayed results and user satisfaction.
- The stability of CRUD operations (adding, editing, deleting) without encountering validation errors.
- Data security ensured through the implementation of login and authentication mechanisms.
