import React, { useState } from "react";
import { postProject } from ".";

export interface FormValues {
	name: string;
	description: string;
	link: string;
}

export default function CreateProjectDialog({ userID }: { userID: string }) {
	const [formValues, setFormValues] = useState<FormValues>({
		name: "",
		description: "",
		link: "",
	});

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formValues: FormValues) => {
		e.preventDefault();

		const { name, description, link } = formValues;

		const res = await postProject({
			name,
			description,
			userID,
			link,
		});

		if (res.acknowledged) {
			window.location.reload();
		}
	};

	return (
		<>
			<button
				className="btn btn-accent my-10 font-bold"
				onClick={() => (window as any).add_user_modal.showModal()}
			>
				Create New Project
			</button>
			<dialog id="add_user_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-11/12 max-w-4xl p-10"
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit(e, formValues);
					}}
				>
					<h3 className="mb-4 text-xl font-bold">Create New Project</h3>
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
						placeholder="Project Description (min. 20 characters)"
					/>

					<input
						required
						className="input input-bordered mb-3 w-full"
						placeholder="Project Link (Github, etc.)"
						type="url"
						onChange={(e) => {
							if (!e.target.value.startsWith("https://")) {
								e.target.value = "https://" + e.target.value;
							}
							setFormValues({ ...formValues, link: e.target.value });
						}}
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
