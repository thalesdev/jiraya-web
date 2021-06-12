import { createContext, ReactNode, useEffect, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';

import { api } from '../services/api';
import { cookies } from '../config/auth'
import { useSession, signOut as signOutSocial } from 'next-auth/client';

type User = {
	email: string;
};

type SignInCredentials = {
	email: string;
	password: string;
}

type SignUpCredentials = {
	email: string;
	fullname: string;
	username: string;
	password: string;
}


type ForgotCredentials = {
	email: string;
}

type RecoveryCredentials = {
	code: string;
	password: string;
	password_confirmation: string;
}

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signUp: (credentials: SignUpCredentials) => Promise<void | any>;
	forgot: (credentials: ForgotCredentials) => Promise<void | any>;
	recovery: (credentials: RecoveryCredentials) => Promise<void | any>;
	signOut: () => void;
	user: User;
	isAuthenticated: boolean;
};

interface AuthProviderProps {
	children: ReactNode;
}

let authChannel: BroadcastChannel

export function signOut() {
	destroyCookie(undefined, cookies.accessToken)
	destroyCookie(undefined, cookies.refreshToken)

	authChannel.postMessage('signOut');

	Router.push('/signin')
}


export const AuthContext = createContext({} as AuthContextData)


export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>()
	const isAuthenticated = !!user;

	const [session,] = useSession()

	useEffect(() => {
		authChannel = new BroadcastChannel('auth')

		authChannel.onmessage = (message) => {
			switch (message.data) {
				case 'signOut':
					signOut();
					authChannel.close()
					break;
				default:
					break;
			}
		}
	}, [])

	useEffect(() => {
		const { [cookies.accessToken]: token } = parseCookies()
		if (token) {
			api.get('/me')
				.then(response => {
					const { email } = response.data
					setUser({ email })
				})
				.catch(() => {
					signOut();
				})
		}
	}, [])


	useEffect(() => {

		const { [cookies.accessToken]: token } = parseCookies()

		if (session && session.token && !token) {
			const { email } = session.user;
			setCookie(undefined, cookies.accessToken, session.token.access, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setCookie(undefined, cookies.refreshToken, session.token.refresh, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})
			setUser({
				email,
			})

			api.defaults.headers['Authorization'] = `Bearer ${session.token.access}`;


			Router.push('/');

			signOutSocial()

		}
	}, [session])


	async function signIn({ email, password }: SignInCredentials) {
		try {
			const response = await api.post('auth/signin', {
				email,
				password,
			})


			const { access: { token }, refresh: { token: refreshToken } } = response.data;

			setCookie(undefined, cookies.accessToken, token, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setCookie(undefined, cookies.refreshToken, refreshToken, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setUser({
				email,
			})

			api.defaults.headers['Authorization'] = `Bearer ${token}`;

			Router.push('/');
		} catch (err) {
			console.log(err); // melhorar os erros
		}
	}

	async function signUp({ email, password, fullname, username }: SignUpCredentials) {
		try {
			const response = await api.post('auth/signup', {
				email,
				password,
				username,
				fullname
			})


			const { access: { token }, refresh: { token: refreshToken } } = response.data;

			setCookie(undefined, cookies.accessToken, token, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setCookie(undefined, cookies.refreshToken, refreshToken, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			})

			setUser({
				email,
			})

			api.defaults.headers['Authorization'] = `Bearer ${token}`;

			Router.push('/');
		} catch (err) {
			if (err.response) {
				const payload = err.response.data;
				return payload;
			}
			console.log(err); // melhorar os erros
		}
	}

	async function forgot({ email }: ForgotCredentials) {
		try {
			const response = await api.post('auth/forgot', {
				email,
			})

			Router.push('/recovery');
		} catch (err) {
			if (err.response) {
				const payload = err.response.data;
				return payload;
			}
			console.log(err); // melhorar os erros
		}
	}

	async function recovery({ code, password, password_confirmation }: RecoveryCredentials) {
		try {
			await api.post('auth/recovery', {
				code,
				password,
				password_confirmation
			})

			Router.push('/');
		} catch (err) {
			if (err.response) {
				const payload = err.response.data;
				return payload;
			}
			console.log(err); // melhorar os erros
		}
	}



	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signOut, signIn, signUp, forgot, recovery }}>
			{children}
		</AuthContext.Provider>
	)

}