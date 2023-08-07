export const PAGE_SIZE = 5;

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

export async function deleteProject({ projectId }: { projectId: string | undefined }) {
	if (!projectId) return;
	const response = await fetch(`/api/projects/?projectId=${projectId}`, {
		method: "DELETE",
	});
	const data = await response.json();
	return data;
}

export async function assignProject({ projectID, userID }: { projectID: string; userID: string }) {
	const response = await fetch("/api/project_assignment", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ projectID, userID }),
	});
	const data = await response.json();
	return data;
}

export async function removeProject({ projectID, userID }: { projectID: string; userID: string }) {
	const response = await fetch(`/api/project_assignment?projectID=${projectID}&userID=${userID}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	return data;
}

export async function fetchRole({ userID, assignedID }: { userID: string; assignedID: string }) {
	const response = await fetch(`/api/user_role?userID=${userID}&assignedID=${assignedID}`);
	const data = await response.json();
	return data;
}
