## 1. USER INTERFACE ARCHITECTURE

### 1.1 Pages and Layouts

- **Dedicated pages:**
  - Login page (`/login`)
  - Registration page (`/register`)
  - Password recovery page (`/reset-password`)
- **Layout separation:**
  - Public layout: pages accessible without authorization (e.g., landing page, login, registration, password reset)
  - Protected layout (auth layout): pages accessible only after login (e.g., dashboard) with route guard mechanism

### 1.2 Components and Forms

- **Form components:**
  - `LoginForm` – fields: email, password
  - `RegisterForm` – fields: email, password, password confirmation
  - `ResetPasswordForm` – field: email
- **React Integration:**

  - Using Tanstack React Query for handling asynchronous operations
  - Creation of dedicated Zustand store (`authStore`) for session state management

- **Client-side validation:**
  - Checking email format and password complexity (e.g., minimum 8 characters)
  - Display of error messages for individual fields (e.g., "Email cannot be empty", "Password must contain at least 8 characters")

### 1.3 User Interaction Handling

- **User flows:**
  - User attempting to access a protected page is redirected to the login page
  - After successful login, redirect to protected area (dashboard)
  - In case of incorrect data (e.g., wrong email or password), appropriate messages are displayed
- **Notifications and Feedback:**
  - Informing about operation success or errors (loading, error, success)
  - Login/logout button placed in the top right corner of the interface
    - In public layout: "Login" button
    - In protected layout: "Logout" button
- **Limitations:**
  - System does not use external login services (e.g., Google, GitHub)
  - Authentication is based solely on email/password system

## 2. BACKEND LOGIC

### 2.1 Endpoints and Server Actions

- **Creation of endpoints/Server Actions:**
  - `POST /api/auth/register` – user registration
  - `POST /api/auth/login` – user login
  - `POST /api/auth/reset-password` – sending password reset link
  - `POST /api/auth/logout` – user logout
- **Supabase Communication:**
  - Each endpoint accepts input data, validates it, and communicates with Supabase Auth using appropriate SDK

### 2.2 Data Validation and Exception Handling

- **Validation:**
  - Verification of input data correctness (e.g., email format, password strength) using validation tools (e.g., Joi or Supabase mechanism)
- **Exception handling:**
  - Global mechanism for catching errors, logging exceptions, and passing readable messages to the user

### 2.3 Page Rendering Updates

- **Server-side rendering (SSR):**
  - Public pages rendered normally
  - Protected pages verify active user session before rendering
- **Middleware:**
  - Implementation of Next.js middleware to verify session token (JWT) before providing protected resources

## 3. AUTHENTICATION SYSTEM

### 3.1 Supabase Auth Integration

- **Main assumptions:**
  - Registration, login, logout, and password reset implemented using Supabase Auth
  - Session state synchronization between frontend and backend using tokens (JWT)
  - No integration with external authorization providers
- **Interaction:**
  - Using official Supabase SDK for communication in both layers

### 3.2 Integration with Next.js App Router and React

- **Server Actions:**
  - Implementation of authorization operations as Server Actions, facilitating SSR integration
- **Context and Middleware:**
  - Creation of dedicated Zustand store (`authStore`) for session state management
  - Middleware protecting routes, checking session token presence and validity
- **Security:**
  - Implementation of protection against CSRF, XSS attacks, and brute-force protection
  - Management of session token lifecycle and refresh mechanism
