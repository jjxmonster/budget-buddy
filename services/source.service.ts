"use server"

import { createClient } from "@/db/supabase.client"
import { CreateSourceCommand, SourceDTO, UpdateSourceCommand } from "@/types/types"

export async function getSources(): Promise<SourceDTO[]> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("source").select("*")

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createSource(command: CreateSourceCommand): Promise<SourceDTO> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("source").insert(command).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateSource(command: UpdateSourceCommand): Promise<SourceDTO> {
	const supabase = await createClient()
	const { data, error } = await supabase.from("source").update(command).eq("id", command.id).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteSource(id: number): Promise<void> {
	const supabase = await createClient()
	const { error } = await supabase.from("source").delete().eq("id", id)

	if (error) {
		throw new Error(error.message)
	}
}
