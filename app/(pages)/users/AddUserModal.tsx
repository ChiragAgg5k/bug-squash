"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { postUser } from ".";
import { AssignedUser } from "@/app/types";

interface UserDetails {
	email: string;
	role: string;
}

export default function AddUserModal() {
	const [user, setUser] = useState<UserDetails>({
		email: "",
		role: "",
	});

	const [allUsers, setAllUsers] = useState<AssignedUser[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		fetch("/api/users")
			.then((res) => res.json())
			.then((data) => {
				setAllUsers(data);
			});
	}, []);

	const handleSubmit = async (user: UserDetails, session: Session | null) => {
		if (user.role === "") {
			setErrorMessage("Please select a role");
			return;
		}

		let userExists = false;
		allUsers.map(async (u) => {
			if (u.email === user.email) {
				userExists = true;
				const res = await postUser({
					assignedId: u._id.toString(),
					assigneesId: session?.user.id,
					role: user.role,
				});

				if (res.acknowledged) {
					window.location.reload();
				}
			}
		});

		if (!userExists) {
			setErrorMessage("User does not exist");
			return;
		}
	};

	return (
		<>
			<button
				className="btn btn-accent max-w-xs font-bold"
				onClick={() => (window as any).add_user_modal.showModal()}
			>
				Add User
			</button>
			<dialog id="add_user_modal" className="modal">
				<form
					method="dialog"
					className="modal-box p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(user, session);
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Add New User</h3>
					<input
						required
						onChange={(e) => {
							setUser({ ...user, email: e.target.value });
						}}
						type="email"
						className="input input-bordered mb-3 w-full"
						placeholder="Email"
					/>
					<select
						required
						onChange={(e) => {
							setUser({ ...user, role: e.target.value });
						}}
						className="select select-bordered mb-4 block w-full max-w-xs"
						defaultValue={"Select Role"}
					>
						<option disabled>Select Role</option>
						<option>Admin</option>
						<option>Developer</option>
						<option>Tester</option>
						<option>Manager</option>
					</select>
					<button type="submit" className="btn btn-accent w-full">
						Add User
					</button>
					<p className="mt-2">{errorMessage}</p>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
