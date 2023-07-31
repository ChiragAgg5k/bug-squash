"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUsers } from "../../users";
import { AssignedUser, AssignedUserList } from "@/app/types";

export default function AssignedUsers({ projectId }: { projectId: string }) {
	const { data: session } = useSession();
	const [assignedUsers, setAssignedUsers] = useState<AssignedUserList[] | undefined>(undefined);

	useEffect(() => {
		if (!session) return;

		const data = fetchUsers({
			assigneesId: session.user.id,
		});

		data.then((res) => {
			setAssignedUsers(
				res.map((user: AssignedUser) => {
					let assigned = false;
					for (const id of user.assignedProjects) {
						if (id === projectId) {
							assigned = true;
							break;
						}
					}

					return { ...user, assigned };
				})
			);
		});
	}, [projectId, session]);

	if (!assignedUsers) {
		return <p className="col-span-3 my-4 text-center">Loading...</p>;
	}

	if (assignedUsers.filter((user) => user.assigned).length === 0) {
		return <p className="col-span-3 my-4 text-center">No users found</p>;
	}

	return (
		<div className="mb-4">
			{assignedUsers
				.filter((user) => user.assigned)
				.map((user, index) => (
					<>
						<p>
							{index + 1}. - {user.userName} - {user.userEmail} - {user.userRole}
						</p>
					</>
				))}
		</div>
	);
}
