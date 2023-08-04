"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AssignedUser, fetchedUser } from "@/app/types";
import { fetchUserDetails, fetchUsers } from "../../users";
import { assignProject } from "..";

const HEADERS = ["User", "Email", "Role", "Assign"];

interface fetchedUserWithAssigned extends fetchedUser {
	assigned: boolean;
}

export default function AssignUserModal({ project }: { project: string }) {
	const projectObj = JSON.parse(project);
	const { data: session } = useSession();
	const [assignedUsers, setAssignedUsers] = useState<fetchedUserWithAssigned[]>([]);

	const handleSubmit = async () => {
		for (const user of assignedUsers) {
			if (user.assigned) {
				const res = await assignProject({
					projectID: projectObj._id,
					userID: user._id.toString(),
				});
				console.log(res);
			}
		}
	};

	useEffect(() => {
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
					if (projectObj.assignedUsers && projectObj.assignedUsers.includes(userDetail._id)) {
						userDetail.assigned = true;
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
	}, [projectObj.assignedUsers, session]);

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
							<>
								<p className="mb-3" key={`name ${index}`}>
									{user.name}
								</p>
								<p className="mb-3" key={`email ${index}`}>
									{user.email}
								</p>
								<p className="mb-3" key={`role ${index}`}>
									{user.role}
								</p>
								<input
									type="checkbox"
									className="checkbox"
									checked={user.assigned}
									onChange={(e) => {
										const newUsers = [...assignedUsers];
										newUsers[index].assigned = e.target.checked;
										setAssignedUsers(newUsers);
									}}
								/>
							</>
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
