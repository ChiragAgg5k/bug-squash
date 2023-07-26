"use client";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { PAGE_SIZE, deleteProject, fetchProjects, postProject } from ".";
import { Project } from "@/app/types";
import { useSession } from "next-auth/react";
import CreateProjectDialog, { FormValues } from "./CreateProjectDialog";

function TableBody(
	data: any,
	currPageIndex: number,
	setOpenConfirmationDialog: (open: boolean) => void,
	setProjectToDelete: (project: Project) => void
) {
	const totalLength = data.length;
	const rows = [];

	for (let i = currPageIndex; i < currPageIndex + PAGE_SIZE && i < totalLength; i++) {
		rows.push(
			<tr key={i} className="border-b">
				<td className="px-4 py-2">{data[i].name}</td>
				<td className="px-4 py-4">
					<p className="line-clamp-4">{data[i].description}</p>
				</td>
				<td className="px-4 py-2">
					<button className="m-2 rounded bg-cyan-600 px-4 py-2 font-bold text-white transition-all ease-in-out hover:bg-cyan-700">
						Details
					</button>
					<button className="ease-in-ou m-2 rounded bg-teal-600 px-4 py-2 font-bold text-white transition-all hover:bg-teal-700">
						Edit
					</button>
					<button
						onClick={() => {
							setProjectToDelete(data[i]);
							setOpenConfirmationDialog(true);
						}}
						className="ease-in-ou m-2 rounded bg-emerald-600 px-4 py-2 font-bold text-white transition-all hover:bg-emerald-700"
					>
						Delete
					</button>
				</td>
			</tr>
		);
	}

	return rows;
}

function LoadingTable() {
	return (
		<tbody>
			<tr className="border-b">
				<td colSpan={3} className="text-center">
					<p className="my-4">Loading...</p>
				</td>
			</tr>
		</tbody>
	);
}

function EmptyTable() {
	return (
		<tbody>
			<tr className="border-b">
				<td colSpan={3} className="text-center">
					<p className="my-4">No projects found.</p>
				</td>
			</tr>
		</tbody>
	);
}

function ConfirmationDialog({
	open,
	setOpenDialog,
	projectToDelete,
	projects,
}: {
	open: boolean;
	setOpenDialog: (open: boolean) => void;
	projectToDelete: Project | undefined;
	projects: Project[];
}) {
	return (
		<div
			className={`fixed left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-black/70 ${
				open ? "flex" : "hidden"
			}
				`}
		>
			<div className="border-3 relative rounded border-teal-400 bg-[#D6DBDC] p-10 dark:border-teal-700 dark:bg-zinc-800">
				<h3 className="my-4 text-center text-xl sm:text-2xl">Delete Project ?</h3>
				<div className="flex items-center justify-center">
					<button
						className="m-3 rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
						onClick={() => {
							deleteProject({
								projectId: projectToDelete?._id!,
							}).then((data) => {
								if (data.acknowledged) {
									projectToDelete = undefined;
									projects.splice(projects.indexOf(projectToDelete!), 1);
									setOpenDialog(false);
								}
							});
						}}
					>
						Yes
					</button>
					<button
						className="m-3 rounded bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
						onClick={() => {
							setOpenDialog(false);
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ProjectsPage() {
	const [pagesToShow, setPagesToShow] = useState(0);
	const [projects, setProjects] = useState<Project[] | undefined>(undefined);
	const [openDialog, setOpenDialog] = useState(false);
	const { data: session } = useSession();

	const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

	useEffect(() => {
		fetchProjects({
			userID: session?.user?.id,
		}).then((data) => {
			setProjects(data);
		});
	}, [session?.user?.id]);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formValues: FormValues) => {
		e.preventDefault();

		if (!session?.user?.id || projects === undefined) {
			return;
		}

		const { name, description } = formValues;
		const userID = session.user.id;

		const project = await postProject({
			name,
			description,
			userID,
		});

		if (!project.acknowledged) {
			return;
		}

		setOpenDialog(false);
		setProjects([
			...projects,
			{
				_id: project.insertedId,
				name: name,
				description: description,
				userID: userID,
			},
		]);
	};

	return (
		<>
			<NavBar />
			<div className="mx-8 pt-28">
				<h1 className="mb-4 text-2xl">Your Projects</h1>
				<p>All of your projects are listed here:</p>
				<table className="mt-6 w-full border-b-2 border-gray-500">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-4">Name</th>
							<th className="px-4 py-4">Description</th>
							<th className="px-4 py-4">Operations</th>
						</tr>
					</thead>

					{projects === undefined ? (
						<LoadingTable />
					) : (
						(projects.length === 0 && <EmptyTable />) || (
							<>
								<tbody>
									{TableBody(projects, pagesToShow, setOpenConfirmationDialog, setProjectToDelete)}
								</tbody>
								<tfoot>
									<tr>
										<td colSpan={2}>
											Current Page: {Math.floor(pagesToShow / PAGE_SIZE) + 1} of{" "}
											{Math.ceil(projects.length / PAGE_SIZE)}
										</td>
										<td className="mb-3 flex flex-col items-center justify-end text-right transition-all ease-in-out sm:flex-row">
											<button
												disabled={pagesToShow === 0}
												className="mt-3 whitespace-nowrap rounded bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 disabled:bg-gray-600 sm:mr-4"
												onClick={() => setPagesToShow(pagesToShow - PAGE_SIZE)}
											>
												Previous Page
											</button>
											<button
												disabled={pagesToShow + PAGE_SIZE >= projects.length}
												className="mt-3 whitespace-nowrap rounded bg-teal-600 px-4 py-2 font-bold text-white transition-all ease-in-out hover:bg-teal-700 disabled:bg-gray-600"
												onClick={() => setPagesToShow(pagesToShow + PAGE_SIZE)}
											>
												Next Page
											</button>
										</td>
									</tr>
								</tfoot>
							</>
						)
					)}
				</table>
				<div className="my-12">
					<button
						className="rounded bg-teal-600 px-4 py-2 font-bold text-white transition-all ease-in-out hover:bg-teal-700"
						onClick={() => {
							setOpenDialog(true);
						}}
					>
						Create New Project
					</button>
				</div>
				<CreateProjectDialog
					handleFormSubmit={handleFormSubmit}
					open={openDialog}
					setOpenDialog={setOpenDialog}
				/>
				<ConfirmationDialog
					projects={projects ?? []}
					open={openConfirmationDialog}
					setOpenDialog={setOpenConfirmationDialog}
					projectToDelete={projectToDelete}
				/>
			</div>
		</>
	);
}
