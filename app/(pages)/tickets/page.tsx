import NavBar from "@/components/NavBar";

export default function TicketsPage() {
	return (
		<>
			<NavBar />
			<div className="mx-8 pt-28">
				<h1 className="mb-4 text-2xl">Manage Tickets</h1>
				<h3 className="">The following tickets are currently open and need to be resolved:</h3>
			</div>
		</>
	);
}
