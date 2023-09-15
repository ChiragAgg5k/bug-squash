import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignoutButton from "./SignoutButton";
import HelpToast from "./HelpToast";

export default async function ProfilePage() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="flex flex-grow flex-col items-center justify-center sm:flex-row">
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

			<SignoutButton />

			<HelpToast />
		</div>
	);
}
