import { AiFillCloseSquare } from "react-icons/ai";

export default function CreateProjectDialog({
	userID,
	handleFormSubmit,
	open,
	setOpenDialog,
}: {
	userID: string | undefined;
	handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	open: boolean;
	setOpenDialog: (open: boolean) => void;
}) {
	return (
		<div
			className={`fixed left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-black/70 ${
				open ? "flex" : "hidden"
			}
				`}
		>
			<div className="relative mx-12 w-full max-w-3xl rounded border-2 border-teal-700 bg-zinc-800 p-6 sm:p-10">
				<div className="mb-8 flex items-center justify-between">
					<h3 className="text-xl sm:text-2xl">Create New Project</h3>
					<AiFillCloseSquare
						onClick={() => {
							setOpenDialog(false);
						}}
						className=" cursor-pointer text-4xl hover:text-teal-700"
					/>
				</div>
				<form onSubmit={handleFormSubmit}>
					<div className="mb-4">
						<label htmlFor="name" className="block text-sm font-medium text-gray-400">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							required
							className="mt-1 block w-full rounded-md border-gray-300 p-3 text-black shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
							placeholder="Project Name"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="description" className="block text-sm font-medium text-gray-400">
							Description
						</label>
						<textarea
							name="description"
							id="description"
							required
							rows={3}
							minLength={10}
							maxLength={500}
							className="mt-1 block w-full rounded-md border-gray-300 p-4 text-black shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
							placeholder="Project Description"
						/>
					</div>

					<div className="mt-4">
						<button
							type="submit"
							className="rounded bg-cyan-600 px-4 py-2 font-bold text-white hover:bg-cyan-700"
						>
							Create Project
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
