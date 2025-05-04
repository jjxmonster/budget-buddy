"use server"

import { createClient } from "@/db/supabase.client"
import { CategoryDTO, CreateCategoryCommand, UpdateCategoryCommand } from "@/types/types"

export async function getCategories(): Promise<CategoryDTO[]> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { data, error } = await supabase.from("category").select("*").eq("user_id", user.user?.id)

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createCategory(command: CreateCategoryCommand): Promise<CategoryDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { data, error } = await supabase
		.from("category")
		.insert({ ...command, user_id: user.user?.id })
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateCategory(command: UpdateCategoryCommand): Promise<CategoryDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { data, error } = await supabase
		.from("category")
		.update({ ...command, user_id: user.user?.id })
		.eq("id", command.id)
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteCategory(id: number): Promise<void> {
	const supabase = await createClient()
	const { error: sessionError } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { error } = await supabase.from("category").delete().eq("id", id)

	if (error) {
		throw new Error(error.message)
	}
}
