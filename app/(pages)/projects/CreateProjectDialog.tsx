import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export interface FormValues {
	name: string;
	description: string;
}

export default function CreateProjectDialog({
	handleFormSubmit,
	open,
	setOpenDialog,
}: {
	handleFormSubmit: (e: React.FormEvent<HTMLFormElement>, formValues: FormValues) => void;
	open: boolean;
	setOpenDialog: (open: boolean) => void;
}) {
	const [formValues, setFormValues] = useState<FormValues>({
		name: "",
		description: "",
	});

	return (
		<div
			className={`fixed left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-black/70 ${
				open ? "flex" : "hidden"
			}
				`}
		>
			<div className="border-3 relative mx-12 w-full max-w-3xl rounded border-teal-400 bg-[#D6DBDC] p-6 dark:border-teal-700 dark:bg-zinc-800 sm:p-10">
				<div className="mb-8 flex items-center justify-between">
					<h3 className="text-xl sm:text-2xl">Create New Project</h3>
					<AiFillCloseSquare
						onClick={() => {
							setFormValues({
								name: "",
								description: "",
							});
							setOpenDialog(false);
						}}
						className=" cursor-pointer text-4xl transition-all ease-in-out hover:text-teal-600"
					/>
				</div>
				<form
					onSubmit={(event) => {
						handleFormSubmit(event, formValues);
						setFormValues({
							name: "",
							description: "",
						});
					}}
				>
					<div className="mb-4">
						<label htmlFor="name" className="block text-sm font-medium text-gray-400">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							required
							className="mt-1 block w-full rounded-md border-2 p-3 text-black shadow-sm transition-all ease-in-out hover:border-gray-400 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
							placeholder="Project Name"
							value={formValues.name}
							onChange={(e) => {
								setFormValues({
									...formValues,
									name: e.target.value,
								});
							}}
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="description" className="block text-sm font-medium text-gray-400">
							Description
						</label>
						<textarea
							name="description"
							rows={4}
							onChange={(e) => {
								setFormValues({
									...formValues,
									description: e.target.value,
								});
							}}
							value={formValues.description}
							minLength={10}
							maxLength={500}
							required
							className="mt-1 block w-full rounded-md border-2 p-4 text-black shadow-sm transition-all ease-in-out hover:border-gray-400 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
							placeholder="Project Description"
						/>
					</div>

					<div className="mt-4">
						<button
							type="submit"
							className="rounded bg-cyan-600 px-4 py-2 font-bold text-white transition-all ease-in-out hover:bg-cyan-700"
						>
							Create Project
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
