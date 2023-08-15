import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TicketsTable from "./TicketsTable";

export default async function TicketsPage() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
	}

	return (
		<>
			<h1 className="mb-4 text-2xl">Manage Tickets</h1>
			<TicketsTable />
		</>
	);
}
