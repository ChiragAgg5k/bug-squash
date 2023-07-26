export const PAGE_SIZE = 3;

export async function fetchProjects({ userID }: { userID: string }) {
	const response = await fetch(`/api/projects?userID=${userID}`);
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

export async function deleteProject({ projectId }: { projectId: string }) {
	const response = await fetch(`/api/projects/?projectId=${projectId}`, {
		method: "DELETE",
	});
	const data = await response.json();
	return data;
}
