import { Project } from "@/app/types";
import { deleteProject } from ".";

export default function ConfirmDeleteProject({ projectToDelete }: { projectToDelete: Project | undefined }) {
	const handleFormSubmit = () => {
		deleteProject({
			projectId: projectToDelete?._id,
		}).then(() => {
			window.location.reload();
		});
	};

	return (
		<>
			<dialog id="confirm_delete_project_modal" className="modal">
				<form
					method="dialog"
					className="modal-box"
					onSubmit={(e) => {
						e.preventDefault();
						handleFormSubmit();
					}}
				>
					<h3 className="mb-4 text-center text-xl font-bold">Delete Project</h3>
					<p className="mb-4 text-center">
						Are you sure you want to delete the project{" "}
						<strong className=" text-teal-500">{projectToDelete?.name}</strong>?
					</p>
					<div className="flex items-center justify-center">
						<button type="submit" className="btn btn-outline m-2 ml-2">
							Yes, Delete
						</button>
						<button
							className="btn btn-accent btn-outline m-2 ml-2"
							onClick={() => {
								(window as any).confirm_delete_project_modal.close();
							}}
						>
							Cancel
						</button>
					</div>
				</form>
				<form method="dialog" className="modal-backdrop bg-transparent">
					<button className="hover:cursor-default">close</button>
				</form>
			</dialog>
		</>
	);
}
