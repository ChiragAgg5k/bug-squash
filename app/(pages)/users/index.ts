import { ObjectId } from "mongodb";

export async function postUser({
	userName,
	userEmail,
	userRole,
	assigneesId,
	assignedProjects,
}: {
	userName: string;
	userEmail: string;
	userRole: string;
	assigneesId: string;
	assignedProjects: string[];
}) {
	const user = await fetch("/api/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userName,
			userEmail,
			userRole,
			assigneesId,
			assignedProjects,
		}),
	});

	const data = await user.json();
	return data;
}

export async function fetchUsers({ assigneesId }: { assigneesId: string }) {
	const response = await fetch(`/api/users?assigneesId=${assigneesId}`);
	const data = await response.json();
	return data;
}

export async function deleteUser({ userId }: { userId: string }) {
	const response = await fetch(`/api/users?userId=${userId}`, {
		method: "DELETE",
	});
	const data = await response.json();
	return data;
}
