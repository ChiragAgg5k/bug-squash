"use client";

import { Ticket } from "@/app/types";
import { fetchSingleProject } from ".";
import { Project } from "@playwright/test";
import { useSession } from "next-auth/react";
import CreateTicketModal from "./CreateTicketModal";
import useSWR from "swr";
import Link from "next/link";
import React, { useState } from "react";

function multiFetcher(tickets: Ticket[]) {
	return Promise.all(
		tickets.map((ticket) => {
			return fetchSingleProject({
				projectID: ticket.projectID,
			});
		})
	);
}

export default function TicketsTable() {
	const { data: session } = useSession();

	const { data: tickets } = useSWR<Ticket[] | undefined>(
		session !== undefined ? `/api/tickets?userID=${session?.user.id}` : undefined,
		async (url) => {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
	);

	const { data: projects } = useSWR<Project[] | undefined>(tickets, multiFetcher);

	const [ticketToDelete, setTicketToDelete] = useState<Ticket | undefined>(undefined);

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
							<th className="px-4 py-4"> </th>
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
										<td className="px-4 py-4">
											<p className="line-clamp-3">{ticket.description}</p>
										</td>
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
											<Link
												className="btn btn-outline mb-2 mr-2 whitespace-nowrap"
												href={`/tickets/${ticket._id}`}
											>
												Go To Ticket
											</Link>
										</td>
									</tr>
								)
						)}
					</tbody>
				</table>
			</div>

			<CreateTicketModal />

			<div className="overflow-x-scroll">
				{tickets !== undefined && tickets?.filter((ticket) => ticket.status === "closed").length > 0 && (
					<div className="mb-24 mt-12">
						<h2 className="mb-4 text-2xl">Closed Tickets</h2>
						<p>
							Here are all of the tickets that have been closed. You can open them again if you need to.
						</p>

						<table className="mt-6 w-full border-b">
							<thead>
								<tr className="border-b border-gray-700 dark:border-gray-300">
									<th className="px-4 py-4">Heading</th>
									<th className="px-4 py-4">Description</th>
									<th className="px-4 py-4">Project</th>
									<th className="px-4 py-4">Priority</th>
									<th className="px-4 py-4"> </th>
								</tr>
							</thead>

							<tbody>
								{tickets
									?.filter((ticket) => ticket.status === "closed")
									.map((ticket, index) => (
										// @ts-ignore
										<tr key={ticket._id} className="border-b border-gray-700 dark:border-gray-300">
											<td className="px-4 py-4">{ticket.heading}</td>
											<td className="line-clamp-3 px-4 py-4">{ticket.description}</td>
											<td className="px-4 py-4">
												{projects?.[index] ? projects[index].name : "Loading..."}
											</td>
											{ticket.priority === "urgent" ? (
												<td className="px-4 py-4 text-red-500">
													{ticket.priority.toUpperCase()}
												</td>
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
												<Link
													className="btn btn-outline mb-2 mr-2 whitespace-nowrap"
													href={`/tickets/${ticket._id}`}
												>
													Go To Ticket
												</Link>
												<button
													className="btn btn-error btn-outline"
													onClick={() => {
														setTicketToDelete(ticket);
														(window as any).confirm_delete_ticket_modal.showModal();
													}}
												>
													Delete
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<dialog id="confirm_delete_ticket_modal" className="modal">
				<form method="dialog" className="modal-box">
					<h3 className="text-lg font-bold">Delete Ticket?</h3>
					<p>Are you sure you want to delete this ticket?</p>
					<div className="modal-action">
						<button className="btn btn-outline">Cancel</button>
						<button
							className="btn btn-error btn-outline"
							onClick={async () => {
								if (ticketToDelete) {
									await fetch(`/api/tickets/ticket?ticketID=${ticketToDelete._id}`, {
										method: "DELETE",
									});
									window.location.reload();
								}
							}}
						>
							Delete
						</button>
					</div>
				</form>
			</dialog>
		</>
	);
}
