export const PAGE_SIZE = 5;

export async function fetchProjects() {
	const response = await fetch("/api/projects");
	const data = await response.json();
	return data;
}

export async function postProject({
	userID,
	name,
	description,
}: {
	userID: string;
	name: string;
	description: string;
}) {
	const response = await fetch("/api/projects", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userID, name, description }),
	});
	const data = await response.json();
	return data;
}
