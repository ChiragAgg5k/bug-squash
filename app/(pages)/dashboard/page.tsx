"use client";
import NavBar from "@/components/NavBar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

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
		return (
			<>
				<NavBar />
				<div className="pt-28">
					<ContentLoader
						height={140}
						width={740}
						speed={1}
						className="ml-8"
						backgroundColor={"#333"}
						foregroundColor={"#999"}
						viewBox="0 0 380 70"
					>
						<rect x="0" y="0" rx="4" ry="4" width="150" height="13" />
					</ContentLoader>
				</div>
			</>
		);
	}

	return (
		<div className="h-screen">
			<NavBar />
			<div className="ml-8 pt-28">
				<h1 className="mb-4 text-2xl font-bold">{"Hello, " + (user?.name ?? "User")}</h1>
				<h3 className="">Here are the analytics for your projects, tickets, and users:</h3>
			</div>
		</div>
	);
}
