"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { postUser } from ".";
import { fetchedUser } from "@/app/types";

export default function AddUserModal() {
	const [email, setEmail] = useState<string | undefined>(undefined);
	const [dropdownUser, setDropdownUser] = useState<fetchedUser | undefined>(undefined);
	const [role, setRole] = useState<string | undefined>(undefined);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { data: session } = useSession();
	const [searchedUsers, setSearchedUsers] = useState<fetchedUser[] | null>(null);

	const handleSubmit = async () => {
		if (email === undefined || role === undefined) {
			setErrorMessage("Please fill out all fields");
			return;
		}

		if (dropdownUser === undefined) {
			setErrorMessage("Please select a user");
			return;
		}

		if (dropdownUser.email !== email) {
			setErrorMessage("Please select a user from the dropdown");
			return;
		}

		const assignedId = dropdownUser._id.toString();

		const res = await postUser({
			assignedId: assignedId,
			assigneesId: session?.user.id,
			role: role,
		});

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	const handleSearch = async (e: any) => {
		if (e.target.value === "") {
			setSearchedUsers(null);
			return;
		}

		const res = await fetch(`/api/users/search?email=${e.target.value}`);
		const data = await res.json();
		setSearchedUsers(data);
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
						handleSubmit();
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Add New User</h3>
					<div className="dropdown w-full">
						<input
							required
							onChange={(e) => {
								setEmail(e.target.value);
								handleSearch(e);
							}}
							type="email"
							className="input input-bordered mb-3 w-full"
							placeholder="Email"
							value={email}
						/>
						<div
							className={`menu dropdown-content rounded-box z-[1] w-full bg-base-100 p-2 shadow ${
								searchedUsers ? "" : "hidden"
							}`}
						>
							{searchedUsers?.length !== 0 ? (
								<ul className="menu-compact menu">
									{searchedUsers?.map((user) => (
										<li
											key={user._id.toString()}
											className="w-full border-b border-b-base-content/10"
											onClick={() => {
												setDropdownUser(user);
												setEmail(user.email);
												setSearchedUsers(null);
											}}
										>
											<button>{user.email}</button>
										</li>
									))}
								</ul>
							) : (
								<p className="px-4 py-2 text-center">No users found</p>
							)}
						</div>
					</div>
					<select
						required
						onChange={(e) => {
							setRole(e.target.value);
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
