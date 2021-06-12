import { createContext, ReactNode, useEffect, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';

import { api } from '../services/api';
import { cookies } from '../config/auth'

type User = {
	email: string;
};

type SignInCredentials = {
	email: string;
	password: string;
}

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>;
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



	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signOut, signIn }}>
			{children}
		</AuthContext.Provider>
	)

}