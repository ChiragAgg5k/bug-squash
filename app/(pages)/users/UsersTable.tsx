"use client";

import { useSession } from "next-auth/react";
import { fetchUsers } from ".";
import { useEffect, useState } from "react";
import { fetchedUser } from "@/app/types";
import DeleteUserModal from "./DeleteUserModal";

const HEADERS = ["User", "Email", "Role", "Options"];

export default function UsersTable() {
	const { data: session } = useSession();
	const [users, setUsers] = useState<fetchedUser[] | undefined>(undefined);
	const [selectedUser, setSelectedUser] = useState<fetchedUser | undefined>(undefined);

	useEffect(() => {
		if (!session) return;

		const data = fetchUsers({
			assigneesId: session.user.id,
		});

		data.then((res) => {
			setUsers(res);
		});
	}, [session]);

	if (!users) {
		return (
			<>
				<div className="my-4 grid grid-cols-5 items-center overflow-x-auto">
					{HEADERS.map((header, index) => (
						<h3
							className={`mb-3 border-b border-gray-600 pb-2 text-lg font-bold ${
								header === "Email" ? "col-span-2" : ""
							}`}
							key={index}
						>
							{header}
						</h3>
					))}
				</div>
				<p className="col-span-3 my-4 text-center">Loading...</p>
			</>
		);
	}

	if (users.length === 0) {
		return (
			<>
				<div className="my-4 grid grid-cols-5 items-center overflow-x-auto">
					{HEADERS.map((header, index) => (
						<h3
							className={`mb-3 border-b border-gray-600 pb-2 text-lg font-bold ${
								header === "Email" ? "col-span-2" : ""
							}`}
							key={index}
						>
							{header}
						</h3>
					))}
				</div>
				<p className="col-span-3 my-4 text-center">No Users Found.</p>
			</>
		);
	}

	return (
		<>
			<div className="my-4 grid grid-cols-5 items-center overflow-x-auto">
				{HEADERS.map((header, index) => (
					<h3
						className={`mb-3 border-b border-gray-600 pb-2 text-lg font-bold ${
							header === "Email" ? "col-span-2" : ""
						}`}
						key={index}
					>
						{header}
					</h3>
				))}

				{users.map((user) => (
					<>
						<p className="mb-3">{user.userName}</p>
						<p className="col-span-2 mb-3">{user.userEmail}</p>
						<p className="mb-3">{user.userRole}</p>
						<div className="flex items-center justify-start">
							<button
								className="btn btn-outline m-2"
								onClick={() => {
									setSelectedUser(user);
									(window as any).edit_user_modal.showModal();
								}}
							>
								Edit
							</button>
							<button
								className="btn btn-accent btn-outline m-2 ml-2"
								onClick={() => {
									setSelectedUser(user);
									(window as any).delete_user_modal.showModal();
								}}
							>
								Delete
							</button>
						</div>
					</>
				))}
			</div>

			{/* Edit User Modal */}
			<dialog id="edit_user_modal" className="modal">
				<form
					method="dialog"
					className="modal-box p-8"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Edit User</h3>
					{selectedUser && (
						<>
							<input
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, userName: e.target.value });
								}}
								type="text"
								className="input input-bordered mb-3 w-full"
								placeholder="Name"
								value={selectedUser?.userName}
							/>

							<input
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, userEmail: e.target.value });
								}}
								disabled
								type="text"
								className="input input-bordered mb-3 w-full"
								placeholder="Email"
								value={selectedUser?.userEmail}
							/>

							<select
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, userRole: e.target.value });
								}}
								className="select select-bordered mb-4 w-1/2"
								value={selectedUser?.userRole}
							>
								<option>Admin</option>
								<option>Developer</option>
								<option>Tester</option>
								<option>Manager</option>
							</select>
						</>
					)}

					<button type="submit" className="btn btn-accent w-full">
						Edit User
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button>close</button>
				</form>
			</dialog>
			<DeleteUserModal userToDelete={selectedUser} />
		</>
	);
}
