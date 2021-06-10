import { FormEvent, useState } from "react"
import { useAuth } from "../hooks/useAuth"

export default function Home() {

	const { isAuthenticated, user, signIn } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')



	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		console.log(signIn)

		await signIn({
			email, password
		})
	}



	return (
		<>
			{isAuthenticated && <h1>{user.email}</h1>}
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={e => setEmail(e.target.value)} />
				<input type="password" onChange={e => setPassword(e.target.value)} />
				<button>Logar</button>
			</form>
		</>
	)
}
