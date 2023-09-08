"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { fetchProjects } from "../../projects";
import { Project, Ticket, TicketWithoutID } from "@/app/types";

export default function UpdateTicketModal({ ticket }: { ticket: Ticket }) {
	const [newTicket, setNewTicket] = useState<TicketWithoutID>({
		userID: ticket.userID,
		heading: ticket.heading,
		description: ticket.description,
		projectID: ticket.projectID,
		type: ticket.type,
		priority: ticket.priority,
		status: ticket.status,
		comments: ticket.comments,
	});

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const res = await fetch(`/api/tickets/ticket?ticketID=${ticket._id.toString()}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTicket),
		});

		const response = await res.json();

		if (response.acknowledged) {
			window.location.reload();
		}
	};

	const { data: session } = useSession();
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}

		setNewTicket((t) => ({ ...t, userID: session?.user?.id }));

		fetchProjects({
			userID: session?.user?.id,
		}).then((data) => {
			setProjects(data);
		});
	}, [session?.user?.id]);

	return (
		<>
			<button
				className="btn btn-accent mb-10 mt-6 font-bold dark:btn-outline"
				onClick={() => (window as any).edit_ticket_modal.showModal()}
			>
				Edit Ticket
			</button>
			<dialog id="edit_ticket_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-4xl p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit(e);
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Edit Ticket</h3>
					<input
						required
						type="text"
						onChange={(e) => {
							setNewTicket({ ...newTicket, heading: e.target.value });
						}}
						defaultValue={ticket.heading}
						className="input input-bordered mb-3 w-full"
						placeholder="Ticket Heading"
					/>
					<textarea
						required
						rows={3}
						minLength={20}
						defaultValue={ticket.description}
						onChange={(e) => {
							setNewTicket({ ...newTicket, description: e.target.value });
						}}
						className="textarea textarea-bordered mb-3 w-full"
						placeholder="Ticket Description (min. 20 characters)"
					/>

					<select
						className="select select-bordered mb-4 mr-4 block w-full max-w-md"
						onChange={(e) => {
							if (e.target.selectedIndex === 0) return;
							if (!projects) return;

							// @ts-ignore
							setNewTicket({
								...newTicket,
								projectID: projects[e.target.selectedIndex - 1]._id,
							});
						}}
						disabled
						defaultValue={"Project Cannot Be Changed"}
					>
						<option disabled>Project Cannot Be Changed</option>
					</select>

					<select
						className="select select-bordered mb-4 mr-4 inline"
						onChange={(e) => {
							// @ts-ignore
							setNewTicket({ ...newTicket, type: e.target.value.toLowerCase() });
						}}
						defaultValue={ticket.type}
					>
						<option disabled>Ticket Type</option>
						<option value={"bug"}>Bug</option>
						<option value={"feature"}>Feature</option>
						<option value={"improvement"}>Improvement</option>
						<option value={"documentation"}> Documentation</option>
					</select>

					<select
						className="select select-bordered mb-4 mr-4 inline"
						onChange={(e) => {
							// @ts-ignore
							setNewTicket({ ...newTicket, priority: e.target.value.toLowerCase() });
						}}
						defaultValue={ticket.priority}
					>
						<option disabled>Ticket Priority</option>
						<option value={"low"}>Low</option>
						<option value={"medium"}>Medium</option>
						<option value={"high"}>High</option>
						<option value={"urgent"}>Urgent</option>
					</select>

					<select
						className="select select-bordered mb-4 inline"
						onChange={(e) => {
							// @ts-ignore
							setNewTicket({ ...newTicket, status: e.target.value.toLowerCase() });
						}}
						defaultValue={ticket.status}
					>
						<option disabled>Ticket Status</option>
						<option value={"open"}>Open</option>
						<option value={"in-progress"}>In Progress</option>
						<option value={"closed"}>Closed</option>
					</select>

					<button type="submit" className="btn btn-accent w-full">
						Apply Changes
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button className="hover:cursor-default">close</button>
				</form>
			</dialog>
		</>
	);
}
