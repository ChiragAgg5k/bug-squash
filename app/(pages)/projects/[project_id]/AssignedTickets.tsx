"use client";

import { Ticket } from "@/app/types";
import Link from "next/link";
import useSWR from "swr";

export default function AssignedTickets({ projectID }: { projectID: string }) {
	const { data: tickets } = useSWR<Ticket[] | undefined>(
		`/api/tickets/assigned-tickets?projectID=${projectID}`,
		async (url: string) => {
			const res = await fetch(url);
			const data = await res.json();
			return data;
		}
	);

	if (tickets === undefined) return <p>Loading...</p>;

	if (tickets.length === 0) return <p>No tickets assigned.</p>;

	return (
		<div className="flex flex-col">
			{tickets.map((ticket) => (
				<div key={ticket._id} className="mb-4 rounded border p-4">
					<h4 className="mb-2 text-lg">{ticket.heading}</h4>
					<p className="mb-2 line-clamp-1 text-sm">{ticket.description}</p>
					<Link href={`/tickets/${ticket._id}`} className="text-accent hover:underline">
						Go to ticket
					</Link>
				</div>
			))}
		</div>
	);
}
