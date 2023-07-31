"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AssignedUser, AssignedUserList } from "@/app/types";
import { fetchUsers } from "../../users";

const HEADERS = ["User", "Email", "Role", "Assign"];

export default function AssignUserModal({ projectId }: { projectId: string }) {
	const { data: session } = useSession();
	const [assignedUsers, setAssignedUsers] = useState<AssignedUserList[]>([]);

	const handleSubmit = async (users: AssignedUserList[]) => {
		if (users.length === 0) {
			return;
		}

		const res = await fetch("/api/assignUsers", {
			method: "POST",
			body: JSON.stringify({
				users: users,
				projectId: projectId,
			}),
		});

		console.log(res);

		if (res.ok) {
			window.location.reload();
		}
	};

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
						}
					}

					return { ...user, assigned };
				})
			);
		});
	}, [projectId, session]);

	return (
		<>
			<button className="btn btn-accent font-bold" onClick={() => (window as any).my_modal_2.showModal()}>
				Edit Users
			</button>
			<dialog id="my_modal_2" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-5xl p-8"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(assignedUsers).then(() => (window as any).my_modal_2.close());
					}}
				>
					<div className="mb-3 grid grid-cols-4">
						{HEADERS.map((header, index) => (
							<h3 className="mb-3 border-b border-gray-600 pb-2 text-lg font-bold" key={index}>
								{header}
							</h3>
						))}

						{assignedUsers.map((user, index) => (
							<>
								<p className="mb-3">{user.userName}</p>
								<p className="mb-3">{user.userEmail}</p>
								<p className="mb-3">{user.userRole}</p>
								<input
									type="checkbox"
									className="checkbox"
									checked={user.assigned}
									onChange={(e) => {
										setAssignedUsers(
											assignedUsers.map((user, i) => {
												if (i === index) {
													return { ...user, assigned: e.target.checked };
												} else {
													return user;
												}
											})
										);
									}}
								/>
							</>
						))}
					</div>

					<button type="submit" className="btn btn-accent w-full">
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
