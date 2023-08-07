import NavBar from "@/components/NavBar";
import Link from "next/link";
import AssignUserModal from "./AssignUserModal";
import AssignedUsers from "./AssignedUsers";
import fetchProject from ".";

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
				<NavBar />
				<div className="flex h-screen items-center justify-center">
					<p className="text-lg">Project not found</p>
				</div>
			</>
		);
	}

	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="mx-8 pt-28">
				<div className="mb-4 flex items-center justify-between border-b border-gray-500">
					<div>
						<h1 className="mb-4 text-2xl">{project.name}</h1>
						<p className="mb-4">
							<strong className="mr-2">Description:</strong> {project.description}
						</p>
					</div>
					<div>
						<button className="btn btn-outline my-4 ml-4">Edit</button>
						<Link href={`/projects`} className="btn btn-accent btn-outline my-4 ml-4">
							Back
						</Link>
					</div>
				</div>
				<div className="flex">
					<div className="w-full">
						<h2 className="mb-4 text-lg">Assigned Users:</h2>
						<AssignedUsers projectAssignedUsers={project.userIDs} />
						<AssignUserModal projectId={project._id.toString()} projectUserIDs={project.userIDs} />
					</div>

					<div className="w-full">
						<h2 className="mb-4 text-lg">Tickets for this project:</h2>
					</div>
				</div>
			</div>
		</div>
	);
}
