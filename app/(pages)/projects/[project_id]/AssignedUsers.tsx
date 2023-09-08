"use client";

import { fetchUserDetails } from "../../users";
import { AssignedUser } from "@/app/types";
import { fetchRole } from "..";
import useSWR from "swr";

function multiFetcher(params: [string[], string]) {
	const projectAssignedUsers = params[0];
	const projectOwnerID = params[1];

	if (projectAssignedUsers === undefined) return Promise.resolve([]);

	return Promise.all(
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
}
export default function AssignedUsers({
	projectAssignedUsers,
	projectOwnerID,
}: {
	projectAssignedUsers: string[] | undefined;
	projectOwnerID: string;
}) {
	const { data: assignedUsers } = useSWR<AssignedUser[] | undefined>(
		[projectAssignedUsers, projectOwnerID],
		multiFetcher,
		{
			onError: (err) => {
				console.error(err);
				return err;
			},
		}
	);

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
