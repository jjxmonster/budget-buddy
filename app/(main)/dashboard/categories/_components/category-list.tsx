"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { getCategories } from "@/actions/category.actions"
import { Button } from "@/components/ui/button"
import { useCategoryMutations } from "@/query-options/category/mutations"
import { CategoryDTO } from "@/types/types"
import { CategoryTable } from "./category-table"
import { CreateCategoryForm } from "./create-category-form"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { EditCategoryForm } from "./edit-category-form"

export function CategoryList() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null)

	const {
		data: categories = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	})

	const { deleteMutation } = useCategoryMutations()

	const handleAddCategory = () => {
		setIsCreateModalOpen(true)
	}

	const handleEditCategory = (category: CategoryDTO) => {
		setSelectedCategory(category)
		setIsEditModalOpen(true)
	}

	const handleDeleteCategory = (category: CategoryDTO) => {
		setSelectedCategory(category)
		setIsDeleteDialogOpen(true)
	}

	const handleCreateSuccess = () => {
		setIsCreateModalOpen(false)
	}

	const handleEditSuccess = () => {
		setIsEditModalOpen(false)
		setSelectedCategory(null)
	}

	const handleDeleteConfirm = async () => {
		if (!selectedCategory) return
		deleteMutation.mutate(selectedCategory.id)
		setIsDeleteDialogOpen(false)
		setSelectedCategory(null)
	}

	if (error) {
		return <div className="text-red-500">Error loading categories: {(error as Error).message}</div>
	}

	return (
		<div className="space-y-6" data-testid="category-list-container">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Categories</h1>
				<Button onClick={handleAddCategory} data-testid="add-category-button">
					<Plus className="mr-2 h-4 w-4" />
					Add Category
				</Button>
			</div>

			<CategoryTable
				categories={categories}
				isLoading={isLoading}
				onEdit={handleEditCategory}
				onDelete={handleDeleteCategory}
			/>

			{isCreateModalOpen && (
				<CreateCategoryForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateModalOpen(false)} />
			)}

			{isEditModalOpen && selectedCategory && (
				<EditCategoryForm
					category={selectedCategory}
					onSuccess={handleEditSuccess}
					onCancel={() => {
						setIsEditModalOpen(false)
						setSelectedCategory(null)
					}}
				/>
			)}

			<DeleteCategoryDialog
				category={selectedCategory}
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
