"use client"

import { Loader2, Mic, Send, Square } from "lucide-react"
import { useRef, useState } from "react"
import { transcribeAudio } from "@/actions/transcription.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { blobToBase64, pickSupportedAudioMimeType } from "@/utils/helpers"

interface ChatComposerProps {
	value: string
	onChange: (value: string) => void
	onSend: (text: string) => void
	disabled?: boolean
	status: "ready" | "submitted" | "streaming" | "error"
}

export function ChatComposer({ value, onChange, onSend, disabled, status }: ChatComposerProps) {
	const [isRecording, setIsRecording] = useState(false)
	const [recordingError, setRecordingError] = useState<string | null>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const recordedChunksRef = useRef<BlobPart[]>([])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!value.trim() || status !== "ready") return
		onSend(value)
		onChange("")
	}

	const startRecording = async () => {
		try {
			setRecordingError(null)
			if (!navigator.mediaDevices?.getUserMedia) {
				setRecordingError("Microphone not supported in this browser.")
				return
			}
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const mimeType = pickSupportedAudioMimeType()
			const mediaRecorder = new MediaRecorder(stream, { mimeType })
			mediaRecorderRef.current = mediaRecorder
			recordedChunksRef.current = []
			mediaRecorder.ondataavailable = (e) => {
				if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
			}
			mediaRecorder.onstop = async () => {
				try {
					const blob = new Blob(recordedChunksRef.current, { type: mimeType })
					const base64 = await blobToBase64(blob)
					const result = await transcribeAudio({
						audioBase64: base64,
						mimeType,
						diarize: true,
						tagAudioEvents: true,
					})
					if (!result.success) {
						setRecordingError(result.error || "Transcription failed")
						return
					}
					const text = result.text || ""
					if (text) {
						const combined = value ? `${value} ${text}` : text
						if (status === "ready") {
							onSend(combined)
							onChange("")
						} else {
							onChange(combined)
						}
					}
				} catch (err) {
					setRecordingError(err instanceof Error ? err.message : "Recording stopped with error")
				} finally {
					setIsRecording(false)
					mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
					mediaRecorderRef.current = null
				}
			}
			mediaRecorder.start()
			setIsRecording(true)
		} catch (error) {
			setRecordingError(error instanceof Error ? error.message : "Failed to start recording")
		}
	}

	const stopRecording = () => {
		try {
			mediaRecorderRef.current?.stop()
		} catch (error) {
			setRecordingError(error instanceof Error ? error.message : "Failed to stop recording")
		} finally {
			setIsRecording(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="border-t p-4">
			<div className="flex gap-2">
				<Button
					type="button"
					variant={isRecording ? "destructive" : "secondary"}
					size="icon"
					onClick={isRecording ? stopRecording : startRecording}
					title={isRecording ? "Stop recording" : "Start recording"}
					aria-label={isRecording ? "Stop recording" : "Start recording"}
					disabled={disabled}
				>
					{isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
				</Button>
				<Input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Type your message..."
					className="flex-1"
					disabled={disabled}
				/>
				<Button type="submit" disabled={disabled || !value.trim()}>
					{status === "streaming" || status === "submitted" ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</Button>
			</div>
			{recordingError && (
				<p className="text-destructive mt-2 text-xs" role="alert">
					{recordingError}
				</p>
			)}
		</form>
	)
}
