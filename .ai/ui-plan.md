# UI Architecture for BudgetBuddy

## 1. Overview of the UI Structure

The BudgetBuddy application is designed as a modular system that divides the user interface into several key views. The main areas include the authentication screen, dashboard, views for managing categories and sources, and AI integration (chat). The entire system is based on modals for CRUD operations, emphasizing accessibility, responsiveness, and security. Navigation is handled through a sidebar and a top bar visible after authentication.

## 2. List of Views

- **Login/Registration Screen**

  - View Path: `/auth`
  - Main Purpose: To provide secure login/registration for users, enabling access to the application.
  - Key Information: Login and registration forms, validation of data (email, password, password confirmation), error messages.
  - Key Components: Forms, input fields, buttons, toast notifications for error messages (especially for 40\* errors).
  - UX, Accessibility, and Security: Compliance with WCAG AA, clear validation messages, and protection of user data.

- **Dashboard**

  - View Path: `/dashboard/expanses`
  - Main Purpose: To provide an overview and management of the user's expense list.
  - Key Information: Expense table, filtering (date picker, slider, multi-select for categories and sources), sorting by clicking on column headers, pagination.
  - Key Components: Table, filters (date picker, slider, multi-select), CRUD action buttons, error toasts, and cache revalidation.
  - UX, Accessibility, and Security: Intuitive filtering/sorting tools, ease of use, keyboard accessibility and compliance with WCAG AA, secured via authentication.

- **Categories Management View**

  - View Path: `/dashboard/categories`
  - Main Purpose: To add, edit, and delete expense categories.
  - Key Information: List of existing categories, form for creating/editing (name field, max 40 characters), confirmation modal for deletions.
  - Key Components: List, CRUD modals, input fields, buttons, confirmation modal.
  - UX, Accessibility, and Security: Consistent data validation, intuitive modals, and adherence to WCAG AA guidelines.

- **Sources Management View**

  - View Path: `/dashboard/sources`
  - Main Purpose: To add, edit, and delete expense sources.
  - Key Information: List of sources, CRUD form (name field, max 40 characters), confirmation modal.
  - Key Components: List, CRUD modals, input fields, buttons, confirmation modal.
  - UX, Accessibility, and Security: Consistent validation and interaction, responsiveness, and compliance with WCAG AA.

- **AI Chat**

  - View Path: Modal/plugin accessible from the dashboard
  - Main Purpose: To allow the user to ask questions about their expense history and receive immediate responses from the AI.
  - Key Information: Input field for the question, section displaying the AI response, feedback mechanism ("Was this information helpful?").
  - Key Components: Modal, text input, send button, response section, feedback system.
  - UX, Accessibility, and Security: A simple and user-friendly interface, quick responses, easy access from the dashboard, and protection of interactions.

- **User Panel (Top Bar)**

  - View Path: A global element visible on all pages after authentication
  - Main Purpose: To display user information and provide quick access to profile and logout options.
  - Key Information: Avatar, user's name, dropdown menu with options (profile, logout).
  - Key Components: Avatar, text element, dropdown menu.
  - UX, Accessibility, and Security: Easy access to key account options, visibility on various devices, compliance with WCAG AA.

- **Landing Page**
  - View Path: `/`
  - Main Purpose: To present the application and prompt users to log in or register.
  - Key Information: Product description, benefits, CTA buttons for login/registration.
  - Key Components: Banner, CTA buttons, simple layout.
  - UX, Accessibility, and Security: Responsive design, visually appealing, and easy access to key information.

## 3. User Journey Map

**Main Flow** – The user registers or logs in, then manages their expenses:

1. The user visits the Landing Page (`/`) and selects the option to log in or register, navigating to `/auth`.
2. After authentication, the user is directed to the Dashboard (`/dashboard/expenses`), where they review their expense list and use filtering and sorting tools.
3. The user clicks the option to add an expense, which opens a modal for adding (or editing) an expense.
4. Using the action buttons in the table, the user edits or deletes an expense, with deletion requiring confirmation via a modal.
5. Within the dashboard, the user can open the AI chat to ask a question about their expense history.
6. The user navigates to the Categories (`/dashboard/categories`) or Sources (`/dashboard/sources`) management views to make modifications in these areas.
7. The global Top Bar provides the user access to profile options and logout.

## 4. Layout and Navigation Structure

- **Sidebar**: Visible for authenticated users, it contains links to the Dashboard, Categories Management, and Sources Management.
- **Top Bar**: A global element displayed on all pages after login; it includes the avatar, user's name, and an account options menu.
- **Modals**: Used for CRUD operations and AI chat integration, ensuring a consistent interface and allowing quick actions without a full page reload.
- **Routing**: The secure routing mechanism requires authentication, redirecting unauthenticated users to the login screen or Landing Page.

## 5. Key Components

- **Authentication Forms**: Login and registration forms with validation and error messages.
- **Expense Table**: Dynamically updated, with support for filtering (date picker, slider, multi-select), sorting, and pagination.
- **Date Picker, Slider, Multi-Select**: Provide precise data filtering on the dashboard.
- **CRUD Modals**: For adding, editing, and deleting expenses, categories, and sources (including confirmation modals for deletions).
- **AI Chat Modal**: Allows users to ask questions and receive immediate responses from the AI system, with a built-in feedback mechanism.
- **Toast Notifications (sonner)**: Display error messages (especially 40\* errors) as well as standard notifications.
- **Sidebar and Top Bar**: Navigation elements that offer quick access to the main views and features of the application.
- **Responsive Components**: Ensure compatibility with mobile and desktop devices and support for keyboard navigation (WCAG AA).
