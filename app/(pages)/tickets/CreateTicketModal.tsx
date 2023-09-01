"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { fetchProjects } from "../projects";
import { Project, TicketWithoutID } from "@/app/types";
import { postTicket } from ".";

export default function CreateTicketModal() {
	const [ticket, setTicket] = useState<TicketWithoutID>({
		userID: "",
		heading: "",
		description: "",
		projectID: "",
		type: "bug",
		priority: "low",
		status: "open",
		assignedUsers: [],
		comments: [],
	});

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, ticket: TicketWithoutID) => {
		e.preventDefault();
		const res = await postTicket(ticket);

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	const { data: session } = useSession();
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}

		setTicket((t) => ({ ...t, userID: session?.user?.id }));

		fetchProjects({
			userID: session?.user?.id,
		}).then((data) => {
			setProjects(data);
		});
	}, [session?.user?.id]);

	return (
		<>
			<button
				className="btn btn-accent my-10 font-bold"
				onClick={() => (window as any).create_ticket_modal.showModal()}
			>
				Create New Ticket
			</button>
			<dialog id="create_ticket_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-4xl p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit(e, ticket);
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Create New Ticket</h3>
					<input
						required
						type="text"
						onChange={(e) => {
							setTicket({ ...ticket, heading: e.target.value });
						}}
						className="input input-bordered mb-3 w-full"
						placeholder="Ticket Heading"
					/>
					<textarea
						required
						rows={3}
						minLength={20}
						onChange={(e) => {
							setTicket({ ...ticket, description: e.target.value });
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
							setTicket({
								...ticket,
								projectID: projects[e.target.selectedIndex - 1]._id,
							});
						}}
						defaultValue={"Select Project"}
					>
						<option disabled>Select Project</option>
						{projects?.map((project) => (
							<option key={project._id} data-id={project._id}>
								{project.name}
							</option>
						))}
					</select>

					<select
						className="select select-bordered mb-4 mr-4 inline"
						onChange={(e) => {
							// @ts-ignore
							setTicket({ ...ticket, type: e.target.value.toLowerCase() });
						}}
						defaultValue={"Ticket Type"}
					>
						<option disabled>Ticket Type</option>
						<option>Bug</option>
						<option>Feature</option>
						<option>Improvement</option>
						<option> Documentation</option>
					</select>

					<select
						className="select select-bordered mb-4 inline"
						onChange={(e) => {
							// @ts-ignore
							setTicket({ ...ticket, priority: e.target.value.toLowerCase() });
						}}
						defaultValue={"Ticket Priority"}
					>
						<option disabled>Ticket Priority</option>
						<option>Low</option>
						<option>Medium</option>
						<option>High</option>
						<option>Urgent</option>
					</select>

					<button type="submit" className="btn btn-accent w-full">
						Create Ticket
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button className="hover:cursor-default">close</button>
				</form>
			</dialog>
		</>
	);
}
