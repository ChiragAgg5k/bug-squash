import { Ticket } from "@/app/types";
import ProjectDetails from "./ProjectDetails";
import Comments from "./Comments";
import UpdateTicketModal from "./UpdateTicketModal";

export default async function Page({
	params,
}: {
	params: {
		ticket_id: string;
	};
}) {
	const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tickets/ticket?ticketID=${params.ticket_id}`, {
		next: { revalidate: 0 },
	});
	const ticket: Ticket = await res.json();

	return (
		<div className="mb-10">
			<h1 className="mb-4 text-xl">
				Ticket : {ticket.heading} -{" "}
				<span
					className={`${
						ticket.status === "open"
							? "text-teal-500"
							: ticket.status === "in-progress"
							? "text-yellow-500"
							: "text-red-500"
					}`}
				>
					{ticket.status.toUpperCase()}
				</span>
			</h1>
			<div className="mb-4 border-b border-gray-500 pb-6">
				<span className="mb-3 flex flex-col sm:flex-row">
					<p className="mb-4 mr-8">
						<span className="mr-2 underline">Description :</span> {ticket.description}
					</p>
					<p className="mb-4 mr-8">
						<span className="underline">Type :</span> {ticket.type[0].toUpperCase() + ticket.type.slice(1)}
					</p>
					<p className="mb-4">
						<span className="underline">Priority :</span>{" "}
						{ticket.priority[0].toUpperCase() + ticket.priority.slice(1)}
					</p>
				</span>
				<ProjectDetails projectID={ticket.projectID} />
			</div>
			<UpdateTicketModal ticket={ticket} />

			<Comments ticketID={ticket._id} />
		</div>
	);
}
