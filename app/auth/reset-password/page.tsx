import { Metadata } from "next"
import { ResetPasswordForm } from "./_components/reset-password-form"

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Reset your account password",
}

export default function ResetPasswordPage() {
	return <ResetPasswordForm />
}
