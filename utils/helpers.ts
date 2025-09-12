import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

export function pickSupportedAudioMimeType(): string {
	const mimeTypeOptions = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"]
	const globalMediaRecorder = (
		globalThis as unknown as {
			MediaRecorder?: { isTypeSupported?: (t: string) => boolean }
		}
	).MediaRecorder
	const isTypeSupported = globalMediaRecorder?.isTypeSupported?.bind(globalMediaRecorder)
	return mimeTypeOptions.find((t) => (isTypeSupported ? isTypeSupported(t) : false)) || "audio/webm"
}

export async function blobToBase64(blob: Blob): Promise<string> {
	const arrayBuffer = await blob.arrayBuffer()
	const bytes = new Uint8Array(arrayBuffer)
	let binary = ""
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]!)
	}
	return btoa(binary)
}
