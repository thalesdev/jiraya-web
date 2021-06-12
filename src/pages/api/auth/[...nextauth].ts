import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { Session } from 'next-auth'
import { setCookie } from 'nookies'
import { api } from '../../../services/api'

export default NextAuth({
	providers: [
		Providers.GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			scope: 'read:user'
		}),
	],
	callbacks: {
		async session(session: Session, token) {
			if (token.access && token.refresh) {
				return {
					...session,
					token: {
						access: (token.access as any).token,
						refresh: (token.refresh as any).token
					}
				}
			}
			return session;
		},
		async jwt(token, user) {
			if (user) {
				token = {
					...token,
					refresh: user.refresh,
					access: user.access
				}
			}
			return token
		},
		async signIn(user, account, profile) {
			const { email, image, name } = user;
			const { accessToken, provider } = account;
			try {
				const { data: { access, refresh } } = await api.post('auth/social', {
					email,
					image,
					name,
					accessToken,
					provider,
					device: 'Jiraya Web'
				});

				user.access = access;
				user.refresh = refresh;

				return true;
			} catch (error) {
				return false;
			}
		},

	}
})