import { Metadata } from "next"
import { RegisterForm } from "./_components/register-form"

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Create a new account",
}

export default function RegisterPage() {
	return <RegisterForm />
}
