"use client";

import { useEffect, useState } from "react";
import { fetchUserDetails } from "../../users";
import { AssignedUser } from "@/app/types";
import { fetchRole } from "..";

export default function AssignedUsers({
	projectAssignedUsers,
	projectOwnerID,
}: {
	projectAssignedUsers: string[];
	projectOwnerID: string;
}) {
	const [assignedUsers, setAssignedUsers] = useState<AssignedUser[] | undefined>(undefined);

	useEffect(() => {
		async function getUsers() {
			if (projectAssignedUsers === undefined) return;

			const users = await Promise.all(
				projectAssignedUsers.map(async (userID: string) => {
					const userDetail = await fetchUserDetails({
						userID: userID,
					});

					userDetail.role = await fetchRole({
						userID: projectOwnerID,
						assignedID: userID,
					});
					return userDetail;
				})
			);

			return users;
		}

		getUsers().then((users) => {
			if (users === undefined) {
				setAssignedUsers([]);
				return;
			}

			setAssignedUsers(users);
		});
	}, [projectAssignedUsers, projectOwnerID]);

	if (!assignedUsers) {
		return <p className="col-span-3 my-4 text-center">Loading...</p>;
	}

	if (assignedUsers.length === 0) {
		return <p className="col-span-3 my-4 text-center">No users found</p>;
	}

	return (
		<div className="mb-4">
			{assignedUsers.map((user, index) => (
				<p key={index} className="py-2">
					{index + 1}. - {user.name} - {user.email} - {user.role}
				</p>
			))}
		</div>
	);
}
