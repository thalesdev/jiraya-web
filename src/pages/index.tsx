import { GetServerSideProps } from "next"
import { useAuth } from "../hooks/useAuth"
import { withSSRAuth } from "../utils/withSSRAuth"
import { useEffect } from "react"

export default function Home() {

	const { isAuthenticated, user, signOut } = useAuth()
	// const [session, isLogged] = useSession()

	// useEffect(() => console.log('session changed', session), [session])

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