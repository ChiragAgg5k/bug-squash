import NavBar from "@/components/NavBar";
import Image from "next/image";
import { SignOutButton } from "@/components/authButtons";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function ProfilePage() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
	}

	return (
		<>
			<NavBar />
			<div className="flex h-screen flex-col items-center justify-center sm:flex-row">
				<div className="flex items-center justify-center">
					<Image
						src={user.image ?? "/logo.png"}
						alt="Profile Picture"
						width={110}
						height={110}
						className="mr-8 rounded-full"
					/>
					<div>
						<h1 className="text-xl">{user.name}</h1>
						<p className="text-lg">{user.email}</p>
					</div>
				</div>

				<SignOutButton className="mt-2 rounded bg-cyan-700 px-6 py-2 text-white hover:bg-cyan-600 sm:ml-12" />
			</div>
		</>
	);
}
