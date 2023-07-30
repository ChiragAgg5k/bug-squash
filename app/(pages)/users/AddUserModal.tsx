"use client";

import { useState } from "react";
import { postUser } from ".";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface UserDetails {
	name: string;
	email: string;
	role: string;
}

export default function AddUserModal() {
	const [user, setUser] = useState<UserDetails>({
		name: "",
		email: "",
		role: "",
	});

	const { data: session } = useSession();
	const router = useRouter();

	const handleSubmit = async (user: UserDetails, session: Session | null) => {
		if (user.name === "" || user.email === "" || user.role === "" || session === null) {
			return;
		}

		const res = await postUser({
			userName: user.name,
			userEmail: user.email,
			userRole: user.role,
			assigneesId: session.user.id,
		});

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	return (
		<>
			<button className="btn btn-accent ml-8 font-bold" onClick={() => (window as any).my_modal_2.showModal()}>
				Add User
			</button>
			<dialog id="my_modal_2" className="modal">
				<form
					method="dialog"
					className="modal-box p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(user, session).then(() => (window as any).my_modal_2.close());
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Add New User</h3>
					<input
						required
						onChange={(e) => {
							setUser({ ...user, name: e.target.value });
						}}
						type="text"
						className="input input-bordered mb-3 w-full"
						placeholder="Name"
					/>
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
						onChange={(e) => {
							setUser({ ...user, role: e.target.value });
						}}
						className="select select-bordered mb-4 block w-full max-w-xs"
					>
						<option disabled selected>
							{"Select User's Role"}
						</option>
						<option>Admin</option>
						<option>Developer</option>
						<option>Tester</option>
						<option>Manager</option>
					</select>
					<button type="submit" className="btn btn-accent w-full">
						Add User
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
