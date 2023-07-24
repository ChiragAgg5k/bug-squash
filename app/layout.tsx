import { NextAuthProvider } from "@/app/providers/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";

const ubuntu = Ubuntu({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bug Squash",
	description: "A bug tracker for developers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<NextAuthProvider>
				<head>
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
				</head>
				<body className={ubuntu.className}>{children}</body>
			</NextAuthProvider>
		</html>
	);
}
