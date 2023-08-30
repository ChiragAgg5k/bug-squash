import { env } from "@/env";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/mongodb/config";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},

	// @ts-ignore
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "demo@gmail.com",
				},
				password: { label: "Password", type: "password" },
			},

			// @ts-ignore
			async authorize(credentials, req) {
				if (credentials === undefined) throw new Error("Credentials are undefined");

				const credentialDetails = {
					email: credentials.email,
					password: credentials.password,
				};

				if (credentialDetails.email === "demo@gmail.com" && credentialDetails.password === "demo123") {
					return { id: "64eedd0e70135bab8e7695bd", name: "Demo User", email: "demo@gmail.com" };
				}
			},
		}),
		GoogleProvider({
			clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			clientSecret: env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
		}),
		GitHubProvider({
			clientId: env.NEXT_PUBLIC_GITHUB_ID,
			clientSecret: env.NEXT_PUBLIC_GITHUB_SECRET,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user?.id) token.sub = user.id;
			return token;
		},
		async session({ session, token }) {
			session.user && (session.user.id = token.sub!);
			return session;
		},
	},
	theme: {
		logo: "/logo.png",
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
