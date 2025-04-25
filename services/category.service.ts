"use server"

import { createClient } from "@/db/supabase.client"
import { CategoryDTO, CreateCategoryCommand, UpdateCategoryCommand } from "@/types/types"

export async function getCategories(): Promise<CategoryDTO[]> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("category").select("*")

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createCategory(command: CreateCategoryCommand): Promise<CategoryDTO> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("category").insert(command).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateCategory(command: UpdateCategoryCommand): Promise<CategoryDTO> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("category").update(command).eq("id", command.id).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteCategory(id: number): Promise<void> {
	const supabase = await createClient()
	const { error } = await supabase.from("category").delete().eq("id", id)

	if (error) {
		throw new Error(error.message)
	}
}
