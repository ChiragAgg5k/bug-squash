import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
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
