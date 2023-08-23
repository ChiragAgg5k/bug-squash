"use client";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export default function Page() {
	const { status } = useSession();
	const router = useRouter();

	if (status === "loading") {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	if (status === "unauthenticated") {
		router.push("api/auth/signin");
		return;
	}

	router.push("/profile");
}
