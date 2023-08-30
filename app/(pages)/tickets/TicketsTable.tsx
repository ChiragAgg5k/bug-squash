"use client";

import { Ticket } from "@/app/types";
import { useEffect, useState } from "react";
import { fetchSingleProject, getTickets } from ".";
import { Project } from "@playwright/test";
import { useSession } from "next-auth/react";
import CreateTicketModal from "./CreateTicketModal";
import { useRouter } from "next/navigation";

export default function TicketsTable() {
	const [tickets, setTickets] = useState<Ticket[] | undefined>(undefined);
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		getTickets({
			userID: session?.user?.id,
		}).then((data) => {
			setTickets(data);
		});
	}, [session?.user?.id]);

	useEffect(() => {
		if (!tickets) return;

		const getProjects = async () => {
			const projects = await Promise.all(
				tickets.map((ticket) => {
					return fetchSingleProject({
						projectID: ticket.projectID,
					});
				})
			);

			return projects;
		};

		getProjects().then((data) => {
			setProjects(data);
		});
	}, [tickets]);

	return (
		<>
			<p>Here are all of the tickets currently open or in progress in the system:</p>
			<div className="overflow-x-auto">
				<table className="mt-6 w-full border-b">
					<thead>
						<tr className="border-b border-gray-700 dark:border-gray-300">
							<th className="px-4 py-4">Heading</th>
							<th className="px-4 py-4">Description</th>
							<th className="px-4 py-4">Project</th>
							<th className="px-4 py-4">Priority</th>
							<th className="px-4 py-4">Operations</th>
						</tr>
					</thead>

					<tbody>
						{tickets === undefined && (
							<tr className="border-b">
								<td colSpan={5} className="text-center">
									<p className="my-4">Loading...</p>
								</td>
							</tr>
						)}

						{tickets?.length === 0 && (
							<tr className="border-b">
								<td colSpan={5} className="text-center">
									<p className="my-4">No tickets found.</p>
								</td>
							</tr>
						)}

						{tickets?.map(
							(ticket, index) =>
								(ticket.status === "open" || ticket.status === "in-progress") && (
									// @ts-ignore
									<tr key={ticket._id} className="border-b border-gray-700 dark:border-gray-300">
										<td className="px-4 py-4">{ticket.heading}</td>
										<td className="line-clamp-3 px-4 py-4">{ticket.description}</td>
										<td className="px-4 py-4">
											{projects?.[index] ? projects[index].name : "Loading..."}
										</td>
										{ticket.priority === "urgent" ? (
											<td className="px-4 py-4 text-red-500">{ticket.priority.toUpperCase()}</td>
										) : ticket.priority === "high" ? (
											<td className="px-4 py-4 text-orange-500">
												{ticket.priority.toUpperCase()}
											</td>
										) : ticket.priority === "medium" ? (
											<td className="px-4 py-4 text-yellow-500">{ticket.priority}</td>
										) : (
											<td className="px-4 py-4 text-green-500">{ticket.priority}</td>
										)}
										<td className="px-4 py-4">
											<button
												className="btn btn-outline mb-2"
												onClick={() => {
													router.push(`/tickets/${ticket._id}`);
												}}
											>
												Details
											</button>
											<button className="btn btn-accent dark:btn-outline">Close</button>
										</td>
									</tr>
								)
						)}
					</tbody>
				</table>

				<CreateTicketModal />
			</div>
		</>
	);
}
