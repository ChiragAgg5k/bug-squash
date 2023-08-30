"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AssignedUser, fetchedUser } from "@/app/types";
import { fetchUserDetails, fetchUsers } from "../../users";
import { assignProject, removeProject } from "..";

const HEADERS = ["User", "Email", "Role", "Assign"];

interface fetchedUserWithAssigned extends fetchedUser {
	assigned: boolean;
}

export default function AssignUserModal({
	projectUserIDs,
	projectId,
}: {
	projectUserIDs: string[];
	projectId: string;
}) {
	const { data: session } = useSession();
	const [assignedUsers, setAssignedUsers] = useState<fetchedUserWithAssigned[]>([]);

	const handleSubmit = async () => {
		const res = await Promise.all(
			assignedUsers.map(async (user) => {
				if (user.assigned) {
					const res = await assignProject({
						projectID: projectId,
						userID: user._id.toString(),
					});

					return res;
				} else {
					const res = await removeProject({
						projectID: projectId,
						userID: user._id.toString(),
					});

					return res;
				}
			})
		);

		for (const r of res) {
			if (!r.acknowledged) {
				alert("Something went wrong");
				return;
			}
		}

		window.location.reload();
	};

	useEffect(() => {
		if (!session) return;

		async function getUsers() {
			const userIds: AssignedUser[] = await fetchUsers({
				assigneesId: session?.user.id,
			});

			if (userIds === undefined) return;

			const users = await Promise.all(
				userIds.map(async (user) => {
					const userDetail = await fetchUserDetails({
						userID: Object.keys(user)[0],
					});

					userDetail.role = Object.values(user)[0];
					if (projectUserIDs !== undefined && projectUserIDs.includes(userDetail._id.toString())) {
						userDetail.assigned = true;
					} else {
						userDetail.assigned = false;
					}

					return userDetail;
				})
			);

			return users;
		}

		getUsers().then((users) => {
			if (users === undefined) return;
			setAssignedUsers(users);
		});
	}, [projectUserIDs, session]);

	return (
		<>
			<button className="btn btn-accent font-bold" onClick={() => (window as any).assign_user_modal.showModal()}>
				Edit Users
			</button>
			<dialog id="assign_user_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-5xl p-8"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<div className="mb-3 grid max-h-52 grid-cols-4 overflow-auto">
						{HEADERS.map((header, index) => (
							<h3 className="mb-3 border-b border-gray-600 pb-2 text-lg font-bold" key={index}>
								{header}
							</h3>
						))}

						{assignedUsers.map((user, index) => (
							<React.Fragment key={index}>
								<p className="mb-3">{user.name}</p>
								<p className="mb-3">{user.email}</p>
								<p className="mb-3">{user.role}</p>
								<input
									type="checkbox"
									className="checkbox"
									defaultChecked={user.assigned}
									onChange={(e) => {
										const newAssignedUsers = [...assignedUsers];
										newAssignedUsers[index].assigned = e.target.checked;
										setAssignedUsers(newAssignedUsers);
									}}
								/>
							</React.Fragment>
						))}
					</div>

					<button type="submit" className="mt-2wa btn btn-accent w-full">
						Assign User
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
