import * as NextAuth from 'next-auth'
declare module 'next-auth' {
	interface Session {
		token?: {
			access: string;
			refresh: string;
		}
	}
}