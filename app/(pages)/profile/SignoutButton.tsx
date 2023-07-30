"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignoutButton() {
	const router = useRouter();

	async function handleSignOut() {
		await signOut();
		router.push("/api/auth/signin");
	}

	return (
		<button
			onClick={handleSignOut}
			className="mt-2 rounded bg-cyan-700 px-6 py-2 text-white hover:bg-cyan-600 active:bg-cyan-800 sm:ml-12"
		>
			Sign Out
		</button>
	);
}
