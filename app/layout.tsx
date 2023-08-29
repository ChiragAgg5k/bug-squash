import { NextAuthProvider } from "@/app/providers/provider";
import "./globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
	title: "Bug Squash",
	description: "A bug tracker for developers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<NextAuthProvider>
				<head>
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
				</head>
				<body suppressHydrationWarning={true}>
					<NextTopLoader showSpinner={false} color="#0f766e" />
					<NavBar />
					<main className="mx-8 flex min-h-screen flex-col pt-28">{children}</main>
				</body>
			</NextAuthProvider>
		</html>
	);
}
