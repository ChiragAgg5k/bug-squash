import { env } from "@/env";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions, User } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/mongodb/config";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},

	// @ts-ignore
	adapter: MongoDBAdapter(clientPromise),
	providers: [
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
			if (token?.sub) session.user.id = token.sub;
			return session;
		},
	},
	theme: {
		logo: "/logo.png",
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
