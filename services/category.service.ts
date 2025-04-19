"use server"

import supabase from "@/db/supabase.client"
import { CategoryDTO } from "@/types/types"

export async function getCategories(): Promise<CategoryDTO[]> {
	const { data, error } = await supabase.from("category").select("*")

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createCategory(category: CategoryDTO): Promise<CategoryDTO> {
	const { data, error } = await supabase.from("category").insert(category).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateCategory(category: CategoryDTO): Promise<CategoryDTO> {
	const { data, error } = await supabase.from("category").update(category).eq("id", category.id).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteCategory(id: number): Promise<void> {
	const { error } = await supabase.from("category").delete().eq("id", id)

	if (error) {
		throw new Error(error.message)
	}
}
