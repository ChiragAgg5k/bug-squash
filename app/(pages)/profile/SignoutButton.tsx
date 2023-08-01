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
		<button onClick={handleSignOut} className="btn btn-info btn-outline ml-8 font-bold">
			Sign Out
		</button>
	);
}