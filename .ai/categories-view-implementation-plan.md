# Categories Management View Implementation Plan

## 1. Overview

The Categories Management View allows users to add, edit, and delete expense categories, which supports efficient expense organization in the BudgetBuddy application. The view presents a list of existing categories and provides intuitive modal interfaces for managing them.

## 2. View Routing

The view should be accessible at the path: `/dashboard/categories`

## 3. Component Structure

```
app/(main)/dashboard/categories/
├── page.tsx                     # Main page component
└── _components/
    ├── category-list.tsx        # Category list component
    ├── category-table.tsx       # Table with category list
    ├── category-actions.tsx     # Action buttons for each table row
    ├── create-category-form.tsx # Form for adding a new category
    ├── edit-category-form.tsx   # Form for editing a category
    └── delete-category-dialog.tsx # Deletion confirmation dialog
```

## 4. Component Details

### Page

- Component description: Main page component that renders the category list and enables their management
- Main elements: Page header, button for adding a new category, category list component
- Supported interactions: Click on the "Add category" button
- Types: `CategoryDTO`
- Props: None (page component)

### CategoryList

- Component description: Container for the categories table that handles fetching category data
- Main elements: Categories table component, loading information, error information
- Supported interactions: No direct interactions
- Types: `CategoryDTO[]`
- Props: None

### CategoryTable

- Component description: Table displaying the list of categories
- Main elements: Table component from shadcn/ui, column headers, rows with category data, action component for each row
- Supported interactions: Sorting by name
- Types: `CategoryDTO[]`
- Props:
  ```typescript
  {
    categories: CategoryDTO[];
    isLoading?: boolean;
  }
  ```

### CategoryActions

- Component description: Action buttons for each table row, enabling editing and deletion of categories
- Main elements: Edit and delete buttons, modal dialogs
- Supported interactions: Click on edit button, click on delete button
- Types: `CategoryDTO`
- Props:
  ```typescript
  {
    category: CategoryDTO;
    onEdit: (category: CategoryDTO) => void;
    onDelete: (categoryId: number) => void;
  }
  ```

### CreateCategoryForm

- Component description: Form for creating a new category
- Main elements: Category name field, add button, validation handling
- Supported interactions: Filling out the form, clicking the "Add" button
- Supported validation: Category name (required, maximum 40 characters)
- Types: `CategoryDTO`, `CreateCategoryCommand`
- Props:
  ```typescript
  {
    onSuccess?: () => void;
    onCancel?: () => void;
  }
  ```

### EditCategoryForm

- Component description: Form for editing an existing category
- Main elements: Category name field (with current value pre-filled), save changes button
- Supported interactions: Editing the name field, clicking the "Save" button
- Supported validation: Category name (required, maximum 40 characters)
- Types: `CategoryDTO`, `UpdateCategoryCommand`
- Props:
  ```typescript
  {
    category: CategoryDTO;
    onSuccess?: () => void;
    onCancel?: () => void;
  }
  ```

### DeleteCategoryDialog

- Component description: Confirmation dialog for category deletion
- Main elements: Confirmation text, "Cancel" and "Delete" buttons
- Supported interactions: Click on "Cancel" button, click on "Delete" button
- Types: `CategoryDTO`
- Props:
  ```typescript
  {
    category: CategoryDTO;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  ```

## 5. Types

All types needed for the view implementation are already defined in `types/types.ts`:

```typescript
// CategoryDTO - representation of a category from the database
export type CategoryDTO = Database["public"]["Tables"]["category"]["Row"]
// {
//   id: number;
//   name: string;
//   user_id: string;
//   created_at: string;
//   updated_at: string;
// }

// CreateCategoryCommand - data for creating a new category
export type CreateCategoryCommand = Omit<
	Database["public"]["Tables"]["category"]["Insert"],
	"id" | "created_at" | "updated_at"
>
// {
//   name: string;
//   user_id: string;
// }

// UpdateCategoryCommand - data for updating an existing category
export type UpdateCategoryCommand = { id: number } & Omit<Database["public"]["Tables"]["category"]["Update"], "id">
// {
//   id: number;
//   name?: string;
//   user_id?: string;
// }
```

## 6. State Management

For managing the view state, we need the following elements:

### Custom Hook: `useCategoryMutations`

```typescript
function useCategoryMutations() {
	const queryClient = useQueryClient()

	const createMutation = useMutation({
		mutationFn: (data: CreateCategoryCommand) => createCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been added")
		},
		onError: (error) => {
			toast.error(`Error while adding category: ${error.message}`)
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: UpdateCategoryCommand) => updateCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been updated")
		},
		onError: (error) => {
			toast.error(`Error while updating category: ${error.message}`)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been deleted")
		},
		onError: (error) => {
			toast.error(`Error while deleting category: ${error.message}`)
		},
	})

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	}
}
```

### Modal State Management

Using React useState to manage the open/close state of modals:

```typescript
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null)
```

## 7. API Integration

API integration is already implemented through ready-to-use functions in `services/category.service.ts`:

```typescript
// Fetching the list of categories
const {
	data: categories,
	isLoading,
	error,
} = useQuery({
	queryKey: ["categories"],
	queryFn: getCategories,
})

// Creating a category (mutation)
const { createMutation } = useCategoryMutations()
const handleCreate = async (data: CreateCategoryCommand) => {
	await createMutation.mutateAsync(data)
}

// Updating a category (mutation)
const { updateMutation } = useCategoryMutations()
const handleUpdate = async (data: UpdateCategoryCommand) => {
	await updateMutation.mutateAsync(data)
}

// Deleting a category (mutation)
const { deleteMutation } = useCategoryMutations()
const handleDelete = async (id: number) => {
	await deleteMutation.mutateAsync(id)
}
```

## 8. User Interactions

1. **Adding a category**:

   - User clicks the "Add category" button
   - A modal with a form opens
   - User enters the category name
   - After clicking "Add", a request is sent to the API
   - The modal closes after successful category addition

2. **Editing a category**:

   - User clicks the edit button for a selected category
   - A modal with a form pre-filled with current data opens
   - User edits the category name
   - After clicking "Save", a request is sent to the API
   - The modal closes after successful category update

3. **Deleting a category**:
   - User clicks the delete button for a selected category
   - A confirmation dialog opens
   - After clicking "Delete", a request is sent to the API
   - The dialog closes after successful category deletion

## 9. Conditions and Validation

1. **Category name validation**:

   - The field is required
   - Maximum length: 40 characters
   - Error messages are displayed directly below the form field

2. **Form validation**:
   - Confirmation buttons are disabled when the form contains errors
   - When an API error occurs, the message is displayed as a toast notification

## 10. Error Handling

1. **API error handling**:

   - All API errors are caught and displayed as toast messages
   - Error categorization:
     - Validation errors (400) - displayed next to the appropriate fields
     - Authorization errors (401) - redirect to the login page
     - Server errors (500) - general error message

2. **Empty data state handling**:
   - Displaying "No categories" information when the list is empty
   - Displaying "Add first category" button in case of an empty list

## 11. Implementation Steps

1. Creating directory and file structure:

   ```
   mkdir -p app/(main)/dashboard/categories/_components
   touch app/(main)/dashboard/categories/page.tsx
   touch app/(main)/dashboard/categories/_components/category-list.tsx
   touch app/(main)/dashboard/categories/_components/category-table.tsx
   touch app/(main)/dashboard/categories/_components/category-actions.tsx
   touch app/(main)/dashboard/categories/_components/create-category-form.tsx
   touch app/(main)/dashboard/categories/_components/edit-category-form.tsx
   touch app/(main)/dashboard/categories/_components/delete-category-dialog.tsx
   ```

2. Implementation of the main page component (`page.tsx`):

   - Import necessary components
   - Page composition with header and category list

3. Implementation of the category list component:

   - Configuration of data fetching from API
   - Handling loading and error states
   - Rendering the table with data

4. Implementation of the table component:

   - Configuration of columns and data
   - Implementation of row actions

5. Implementation of forms and dialogs:

   - Adding and editing forms with validation
   - Deletion confirmation dialog

6. Implementation of actions for table rows:

   - Edit and delete buttons
   - Handling clicks and opening appropriate modals

7. Component integration:

   - Connecting all components
   - Testing integration and proper data flow

8. Functionality testing:
   - Testing all user interactions
   - Testing validation
   - Testing error handling
