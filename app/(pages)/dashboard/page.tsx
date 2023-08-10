import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Graphs from "./Graphs";

export default async function Dashboard() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
	}

	return (
		<>
			<h1 className="mb-4 text-2xl font-bold">{"Hello, " + (user?.name ?? "User")}</h1>
			<h3 className="">Here are the analytics for your projects, tickets, and users:</h3>
			{/* <Graphs /> */}
		</>
	);
}
