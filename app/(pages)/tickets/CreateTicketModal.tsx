import React, { useState } from "react";

export interface FormValues {
	name: string;
	description: string;
}

export default function CreateTicketModal({ userID }: { userID: string }) {
	const [formValues, setFormValues] = useState<FormValues>({
		name: "",
		description: "",
	});

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formValues: FormValues) => {
		e.preventDefault();
	};

	return (
		<>
			<button
				className="btn btn-accent my-10 font-bold"
				onClick={() => (window as any).create_ticket_modal.showModal()}
			>
				Create New Ticket
			</button>
			<dialog id="create_ticket_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-4xl p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit(e, formValues);
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Create New Ticket</h3>
					<input
						required
						type="text"
						onChange={(e) => {
							setFormValues({ ...formValues, name: e.target.value });
						}}
						className="input input-bordered mb-3 w-full"
						placeholder="Project Name"
					/>
					<textarea
						required
						rows={4}
						minLength={20}
						onChange={(e) => {
							setFormValues({ ...formValues, description: e.target.value });
						}}
						className="textarea textarea-bordered mb-3 w-full"
						placeholder="Project Description"
					/>
					<button type="submit" className="btn btn-accent w-full">
						Create Project
					</button>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button className="hover:cursor-default">close</button>
				</form>
			</dialog>
		</>
	);
}
