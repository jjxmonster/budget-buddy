"use server"

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { TextToSpeechConvertRequestOutputFormat } from "@elevenlabs/elevenlabs-js/api"
import { env } from "@/env.mjs"

type TtsOptions = {
	text: string
	voiceId?: string
	modelId?: string
}

export type TtsResult = {
	success: boolean
	audioBase64?: string
	mimeType?: string
	error?: string
}

export async function synthesizeSpeech(options: TtsOptions): Promise<TtsResult> {
	try {
		if (!env.ELEVENLABS_API_KEY) {
			return { success: false, error: "ELEVENLABS_API_KEY is not configured on the server" }
		}

		const { text, voiceId, modelId = "eleven_multilingual_v2" } = options
		if (!text || !text.trim()) {
			return { success: false, error: "Missing text for synthesis" }
		}

		const effectiveVoiceId = voiceId || "JBFqnCBsd6RMkjVDRZzb"

		const client = new ElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY })
		const audioStream = await client.textToSpeech.convert(effectiveVoiceId, {
			text,
			modelId,
			outputFormat: TextToSpeechConvertRequestOutputFormat.Mp344100128,
		})

		const arrayBuffer = await new Response(audioStream as unknown as ReadableStream).arrayBuffer()
		const base64 = Buffer.from(arrayBuffer).toString("base64")

		return {
			success: true,
			audioBase64: base64,
			mimeType: "audio/mpeg",
		}
	} catch (error) {
		console.error("TTS error:", error)
		return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
	}
}
