"use client";
import NavBar from "@/components/NavBar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import Image from "next/image";
import { SignOutButton } from "@/components/authButtons";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
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
				<div className="flex h-screen items-center justify-center">
					<ContentLoader
						height={140}
						width={740}
						speed={1}
						backgroundColor={"#333"}
						foregroundColor={"#999"}
						viewBox="0 0 380 70"
					>
						<rect x="40" y="0" rx="5" ry="5" width="70" height="70" />
						<rect x="120" y="17" rx="4" ry="4" width="150" height="13" />
						<rect x="120" y="40" rx="3" ry="3" width="200" height="10" />
					</ContentLoader>
				</div>
			</>
		);
	}

	return (
		<>
			<NavBar />
			<div className="flex h-screen flex-col items-center justify-center sm:flex-row">
				<div className="flex items-center">
					<Image
						src={user.image ?? "/logo.png"}
						alt="Profile Picture"
						width={110}
						height={110}
						className="mb-8 mr-8 rounded-full"
					/>
					<div>
						<h1 className="text-xl">{user.name}</h1>
						<p className="text-lg">{user.email}</p>
					</div>
				</div>

				<SignOutButton className="ml-12 rounded bg-cyan-700 px-6 py-2 text-white hover:bg-cyan-600" />
			</div>
		</>
	);
}
