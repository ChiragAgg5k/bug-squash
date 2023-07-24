"use client";
import FullPageLoad from "@/components/FullPageLoad";
import NavBar from "@/components/NavBar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const { data: session, status } = useSession();
	const [user, setUser] = useState<Session["user"] | undefined>(undefined);
	const router = useRouter();

	useEffect(() => {
		if (session && session.user) {
			setUser(session.user);
		}

		if (status === "unauthenticated") {
			router.push("/api/auth/signin");
		}
	}, [session, status, router]);

	if (status === "loading" || !user) {
		return <FullPageLoad />;
	}

	return (
		<div className="h-screen">
			<NavBar />
			<div className="ml-8 pt-28">
				<h1 className="text-2xl font-bold">{"Hello, " + (user?.name ?? "User")}</h1>
			</div>
		</div>
	);
}
