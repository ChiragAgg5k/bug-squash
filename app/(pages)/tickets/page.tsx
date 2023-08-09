import NavBar from "@/components/NavBar";
import CreateTicketModal from "./CreateTicketModal";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTickets } from ".";
import TicketsTable from "./TicketsTable";

export default async function TicketsPage() {
	const session = await getServerSession();
	const user = session?.user;

	if (!user) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="mx-8 pt-28">
				<h1 className="mb-4 text-2xl">Manage Tickets</h1>
				<TicketsTable />
			</div>
		</div>
	);
}
