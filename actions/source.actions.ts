"use server"

import { createClient } from "@/db/supabase.client"
import { CreateSourceCommand, SourceDTO, UpdateSourceCommand } from "@/types/types"

export async function getSources(): Promise<SourceDTO[]> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { data, error } = await supabase.from("source").select("*").eq("user_id", user.user?.id)

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createSource(command: CreateSourceCommand): Promise<SourceDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}
	const { data, error } = await supabase
		.from("source")
		.insert({ ...command, user_id: user.user?.id })
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateSource(command: UpdateSourceCommand): Promise<SourceDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { data, error } = await supabase
		.from("source")
		.update({ ...command, user_id: user.user?.id })
		.eq("id", command.id)
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteSource(id: number): Promise<void> {
	const supabase = await createClient()
	const { error: sessionError } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const { error } = await supabase.from("source").delete().eq("id", id)

	if (error) {
		throw new Error(error.message)
	}
}
