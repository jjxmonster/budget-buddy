"use server"

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { env } from "@/env.mjs"

type TranscriptionOptions = {
	audioBase64: string
	mimeType: string
	diarize?: boolean
	tagAudioEvents?: boolean
}

export type TranscriptionResult = {
	success: boolean
	text?: string
	raw?: unknown
	error?: string
}

export async function transcribeAudio(options: TranscriptionOptions): Promise<TranscriptionResult> {
	try {
		if (!env.ELEVENLABS_API_KEY) {
			return { success: false, error: "ELEVENLABS_API_KEY is not configured on the server" }
		}

		const { audioBase64, mimeType, diarize = true, tagAudioEvents = true } = options

		if (!audioBase64) {
			return { success: false, error: "Missing audioBase64" }
		}
		if (!mimeType) {
			return { success: false, error: "Missing mimeType" }
		}

		const audioBytes = Buffer.from(audioBase64, "base64")
		const blob = new Blob([audioBytes], { type: mimeType })

		const client = new ElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY })

		const response = await client.speechToText.convert({
			file: blob as unknown as File | Blob,
			modelId: "scribe_v1",
			tagAudioEvents,
			languageCode: "eng",
			diarize,
		})

		const text = "text" in response ? response.text : undefined

		return { success: true, text, raw: response }
	} catch (error) {
		console.error("Transcription error:", error)
		return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
	}
}
