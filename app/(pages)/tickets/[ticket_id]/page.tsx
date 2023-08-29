"use client";

import { Ticket } from "@/app/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({
	params,
}: {
	params: {
		ticket_id: string;
	};
}) {
	const [ticket, setTicket] = useState<Ticket | undefined>(undefined);

	useEffect(() => {
		if (!params.ticket_id) {
			return;
		}

		fetch(`/api/ticket?ticketID=${params.ticket_id}`)
			.then((res) => res.json())
			.then((data) => {
				setTicket(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [params.ticket_id]);

	if (!ticket) {
		return <h1>Loading...</h1>;
	}

	return (
		<div>
			<h1 className="mb-4 text-xl">
				Ticket : {ticket.heading} -{" "}
				<span
					className={`${
						ticket.status === "open"
							? "text-teal-500"
							: ticket.status === "in-progress"
							? "text-orange-500"
							: "text-red-500"
					}`}
				>
					{ticket.status.toUpperCase()}
				</span>
			</h1>
			<div className="mb-4 border-b border-gray-500 pb-6">
				<span className="mb-3 flex">
					<p className="mr-8">
						<span className="underline">Description :</span> {ticket.description}
					</p>
					<p className="mr-8">
						<span className="underline">Type :</span> {ticket.type[0].toUpperCase() + ticket.type.slice(1)}
					</p>
					<p>
						<span className="underline">Priority :</span>{" "}
						{ticket.priority[0].toUpperCase() + ticket.priority.slice(1)}
					</p>
				</span>
				<span className="flex">
					<p className="mr-8">
						<span className="underline">Project :</span> {ticket.projectID}
					</p>

					<Link href={`/projects/${ticket.projectID}`} className="text-teal-500 hover:underline">
						Go to project page
					</Link>
				</span>
			</div>
			<button className="btn btn-accent btn-outline">Edit Ticket</button>
		</div>
	);
}
