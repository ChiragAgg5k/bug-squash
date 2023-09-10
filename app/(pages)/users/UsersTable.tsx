"use client";

import { useSession } from "next-auth/react";
import { fetchUserDetails, modifyUser } from ".";
import React, { useState } from "react";
import { AssignedUser, fetchedUser } from "@/app/types";
import DeleteUserModal from "./DeleteUserModal";
import useSWR from "swr";

const HEADERS = ["User", "Email", "Role", "Options"];

function multiFetcher(userIds: AssignedUser[]) {
	return Promise.all(
		userIds.map(async (user) => {
			const userDetail = await fetchUserDetails({
				userID: Object.keys(user)[0],
			});

			userDetail.role = Object.values(user)[0];
			return userDetail;
		})
	);
}

export default function UsersTable() {
	const { data: session, status } = useSession();
	const { data: userIds } = useSWR<AssignedUser[] | undefined>(
		status === "loading" ? undefined : `/api/users/assign_user?assigneesId=${session ? session.user.id : ""}`,
		async (url) => {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
	);

	const { data: users } = useSWR<fetchedUser[] | undefined>(userIds, multiFetcher);
	const [selectedUser, setSelectedUser] = useState<fetchedUser | undefined>(undefined);

	const handleModifyUser = async () => {
		if (selectedUser === undefined) return;

		const response = await modifyUser({
			userId: session?.user.id as string,
			assignedUserId: selectedUser._id.toString(),
			roleToModify: selectedUser.role,
		});

		if (response.acknowledged) {
			window.location.reload();
		}
	};

	if (userIds && userIds.length === 0) {
		return (
			<div className="mb-4">
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
			</div>
		);
	}

	if (users === undefined) {
		return (
			<div className="mb-4">
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
			</div>
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

				{users.map((user, index) => (
					<React.Fragment key={index}>
						<p className="mb-3">{user.name}</p>
						<p className="col-span-2 mb-3">{user.email}</p>
						<p className="mb-3">{user.role}</p>
						<div className="flex items-center justify-start">
							<button
								className="btn btn-neutral m-2 dark:btn-outline"
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
					</React.Fragment>
				))}
			</div>

			{/* Edit User Modal */}
			<dialog id="edit_user_modal" className="modal">
				<form
					method="dialog"
					className="modal-box p-8"
					onSubmit={(e) => {
						e.preventDefault();
						handleModifyUser();
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Edit User</h3>
					{selectedUser && (
						<>
							<input
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, name: e.target.value });
								}}
								disabled
								type="text"
								className="input input-bordered mb-3 w-full"
								placeholder="Name"
								value={selectedUser?.name}
							/>

							<input
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, name: e.target.value });
								}}
								disabled
								type="text"
								className="input input-bordered mb-3 w-full"
								placeholder="Email"
								value={selectedUser?.email}
							/>

							<select
								required
								onChange={(e) => {
									setSelectedUser({ ...selectedUser, role: e.target.value });
								}}
								className="select select-bordered mb-4 w-1/2"
								value={selectedUser?.role}
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
			<DeleteUserModal userToDelete={selectedUser} userId={session?.user.id as string} />
		</>
	);
}
