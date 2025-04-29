# Budget Buddy Application Test Plan

## 1. Introduction and Testing Goals

This document presents a comprehensive test plan for the Budget Buddy application - a personal budget management tool. The application is built using the Next.js technology stack and uses Supabase as a backend solution.

**Main testing goals:**

- Ensuring high quality and reliability of the Budget Buddy application
- Verifying correct implementation of all functionalities
- Identifying and removing bugs before production deployment
- Ensuring optimal performance and scalability of the application
- Verifying compliance with business and technical requirements

## 2. Test Scope

The test plan covers the following functional areas of the application:

1. **Authentication and User Management Module**

   - User registration
   - User login
   - User session management
   - User logout

2. **Expense Management Module**

   - Displaying expense list
   - Adding new expenses
   - Editing existing expenses
   - Deleting expenses
   - Filtering and sorting expenses

3. **Category Management Module**

   - Displaying category list
   - Adding new categories
   - Editing existing categories
   - Deleting categories

4. **Funding Source Management Module**

   - Displaying source list
   - Adding new sources
   - Editing existing sources
   - Deleting sources

5. **Reporting and Analysis Module**

   - Generating expense reports
   - Data visualization in the form of charts and summaries

6. **Integrations with External Services (OpenRouter.ai)**
   - Communication with AI models
   - Financial limits on API keys

## 3. Types of Tests to Conduct

### 3.1. Unit Tests

- **Goal:** Testing isolated code fragments (functions, components)
- **Tools:** Vitest
- **Scope:** Services, Utils, Hooks, UI Components

**Example scenarios:**

- Tests of expense filtering functions
- Form validation tests
- UI component rendering tests

### 3.2. End-to-end Tests (E2E)

- **Goal:** Testing the application from a user's perspective
- **Tools:** Playwright
- **Scope:** Complete user flow, interface interactions

**Example scenarios:**

- User registration and login
- Adding a category, source, and expense, then editing and deleting
- Filtering expenses and generating reports

## 4. Test Scenarios for Key Functionalities

### 4.1. Authentication Module

#### 4.1.1. User Registration

1. Verification of registration with correct data
2. Verification of registration with an existing email address
3. Verification of registration with an incorrect email format
4. Verification of registration with a password that doesn't meet security requirements
5. Verification of redirection after successful registration

#### 4.1.2. User Login

1. Verification of login with correct data
2. Verification of login with a non-existent email address
3. Verification of login with an incorrect password
4. Verification of redirection after successful login
5. Verification of the "Forgot Password" function

### 4.2. Expense Management Module

#### 4.2.1. Adding Expenses

1. Verification of adding an expense with all required fields
2. Verification of adding an expense without a title
3. Verification of adding an expense with an incorrect amount
4. Verification of adding an expense with a future date
5. Verification of adding an expense with an assigned category and source

#### 4.2.2. Editing Expenses

1. Verification of editing an expense title
2. Verification of editing an expense amount
3. Verification of editing an expense date
4. Verification of changing an expense category
5. Verification of changing an expense source

#### 4.2.3. Filtering and Sorting Expenses

1. Verification of filtering expenses by date range
2. Verification of filtering expenses by amount range
3. Verification of filtering expenses by category
4. Verification of filtering expenses by source
5. Verification of searching expenses by phrase
6. Verification of sorting expenses by date (ascending/descending)
7. Verification of sorting expenses by amount (ascending/descending)

#### 4.2.4. Deleting Expenses

1. Verification of deleting a single expense
2. Verification of cancelling an expense deletion operation
3. Verification of system behavior after deleting an expense (list update)

### 4.3. Category Management Module

#### 4.3.1. Adding Categories

1. Verification of adding a category with a correct name
2. Verification of adding a category with an existing name
3. Verification of adding a category without a name

#### 4.3.2. Editing and Deleting Categories

1. Verification of editing a category name
2. Verification of deleting a category without associated expenses
3. Verification of deleting a category with associated expenses

### 4.4. Source Management Module

#### 4.4.1. Adding Sources

1. Verification of adding a source with a correct name
2. Verification of adding a source with an existing name
3. Verification of adding a source without a name

#### 4.4.2. Editing and Deleting Sources

1. Verification of editing a source name
2. Verification of deleting a source without associated expenses
3. Verification of deleting a source with associated expenses

## 5. Test Environment

### 5.1. Test Environments

#### 5.1.1. Local Development Environment

- **Goal:** Fast tests during application development
- **Configuration:** Local Supabase instance, Node.js, pnpm
- **Usage:** Unit tests, debugging

#### 5.1.2. Test Environment (staging)

- **Goal:** Comprehensive tests before production deployment
- **Configuration:** Configuration identical to production, but with a test database
- **Usage:** Integration tests, E2E, performance tests

#### 5.1.3. Production Environment

- **Goal:** Monitoring and regression tests in production
- **Configuration:** Production application configuration
- **Usage:** Performance monitoring, smoke tests

### 5.2. Hardware and Software Requirements

- **Operating System:** Windows, macOS, Linux
- **Browsers:** Chrome
- **Devices:** Desktop, tablet, smartphone (various screen sizes)
- **Network Requirements:** Stable internet connection

## 6. Testing Tools

### 6.1. Automated Testing Tools

- **Vitest:** Unit and integration tests
- **Playwright:** E2E tests in multiple browsers

### 6.2. Manual Testing Tools

- **Chrome DevTools:** Debugging, performance analysis, responsiveness testing
- **Postman/Insomnia:** API testing
- **BrowserStack:** Testing on various browsers and devices

### 6.3. Test Management Tools

- **JIRA/Trello:** Test task management
- **GitHub/GitLab:** Bug tracking and pull requests
- **TestRail:** Test case management and reporting

## 7. Test Schedule

### 7.1. Tests in the Development Cycle

- **Unit Tests:** Performed by developers during feature implementation
- **Code Review:** Code and unit test review before merging to the main branch
- **Integration Tests:** Performed after completing implementation of new features

### 7.2. Pre-release Tests

- **Regression Tests:** 1 week before planned release
- **E2E Tests:** 3-5 days before planned release
- **Performance Tests:** 2-3 days before planned release
- **Accessibility Tests:** 2-3 days before planned release
- **Security Tests:** 1 week before planned release

### 7.3. Post-release Tests

- **Smoke Tests:** Immediately after production deployment
- **Performance Monitoring:** Continuous after deployment
- **Regression Tests:** 1-2 days after deployment

## Summary

This test plan provides a comprehensive approach to testing the Budget Buddy application. Its implementation will allow for the delivery of high-quality software that meets user expectations and complies with business requirements. The plan is a dynamic document and may be updated as the project develops and new requirements emerge.
