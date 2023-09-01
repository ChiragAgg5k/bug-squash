import { TicketWithoutID } from "@/app/types";

export async function postTicket(ticket: TicketWithoutID) {
	const response = await fetch("/api/ticket", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(ticket),
	});
	const data = await response.json();
	return data;
}

export async function fetchSingleProject({ projectID }: { projectID: string }) {
	const response = await fetch(`/api/project?projectID=${projectID}`, {
		method: "GET",
	});
	const data = await response.json();
	return data;
}
