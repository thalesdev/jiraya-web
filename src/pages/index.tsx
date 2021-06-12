import { GetServerSideProps } from "next"
import { FormEvent, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Home() {

	const { isAuthenticated, user, signOut } = useAuth()




	return (
		<>
			{isAuthenticated && <h1>{user.email}</h1>}

			<button onClick={() => signOut()}>Sair</button>

		</>
	)
}


export const getServerSideProps: GetServerSideProps = withSSRAuth(async () => {
	return {
		props: {}
	}
})