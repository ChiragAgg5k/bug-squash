import Link from "next/link";
import AssignUserModal from "./AssignUserModal";
import AssignedUsers from "./AssignedUsers";
import fetchProject from ".";
import AssignedTickets from "./AssignedTickets";
import ProjectOwner from "./ProjectOwner";

export default async function ProjectPage({
	params,
}: {
	params: {
		project_id: string;
	};
}) {
	const project = await fetchProject({
		projectId: params.project_id,
	});

	if (!project) {
		return (
			<>
				<div className="flex h-screen items-center justify-center">
					<p className="text-lg">Project not found</p>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="mb-4 flex items-center justify-between border-b border-gray-500">
				<div>
					<h1 className="mb-4 text-2xl">{project.name}</h1>
					<p className="mb-4">
						<strong className="mr-2">Description:</strong> {project.description}
					</p>
					{project.link && (
						<p className="mb-4">
							<strong className="mr-2">Link: </strong>
							<Link
								target="_blank"
								href={project.link}
								className="
								text-teal-500 hover:underline
								"
							>
								{project.link}
							</Link>
						</p>
					)}

					<strong className="mr-2">Project Owner:</strong>
					<ProjectOwner userID={project.userID} />
				</div>
				<div>
					<button className="btn btn-outline my-4 ml-4">Edit</button>
					<Link href={`/projects`} className="btn btn-accent btn-outline my-4 ml-4">
						Back
					</Link>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row">
				<div className="mb-8 w-full">
					<h2 className="mb-4 text-lg">Assigned Users:</h2>
					<AssignedUsers projectAssignedUsers={project.userIDs} projectOwnerID={project.userID} />
					<AssignUserModal projectId={project._id.toString()} projectUserIDs={project.userIDs} />
				</div>

				<div className="w-full">
					<h2 className="mb-4 text-lg">Tickets for this project:</h2>
					<AssignedTickets projectID={project._id.toString()} />
				</div>
			</div>
		</>
	);
}
