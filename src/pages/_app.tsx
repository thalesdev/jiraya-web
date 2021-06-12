import { AuthProvider } from '../contexts/AuthContext'
import { Provider as NexthAuthProvider } from 'next-auth/client'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'


function MyApp({ Component, pageProps }) {
	return (
		<NexthAuthProvider session={pageProps.session}>
			<ChakraProvider theme={theme}>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</ChakraProvider>
		</NexthAuthProvider>
	)
}

export default MyApp
