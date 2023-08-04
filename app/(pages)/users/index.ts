export async function postUser({
	assigneesId,
	assignedId,
	role,
}: {
	assigneesId: string;
	assignedId: string;
	role: String;
}) {
	const user = await fetch("/api/assign_user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			assigneesId,
			assignedId,
			role,
		}),
	});

	const data = await user.json();
	return data;
}

export async function fetchUsers({ assigneesId }: { assigneesId: string }) {
	if (!assigneesId || assigneesId === undefined) return;

	const response = await fetch(`/api/assign_user?assigneesId=${assigneesId}`);
	const data = await response.json();
	return data;
}

export async function fetchUserDetails({ userID }: { userID: string }) {
	const response = await fetch(`/api/user?userID=${userID}`);
	const data = await response.json();
	return data;
}

export async function deleteUser({ userId, userToDeleteId }: { userId: string; userToDeleteId: string }) {
	const response = await fetch(`/api/assign_user?userId=${userId}&userToDeleteId=${userToDeleteId}`, {
		method: "DELETE",
	});
	const data = await response.json();
	return data;
}
