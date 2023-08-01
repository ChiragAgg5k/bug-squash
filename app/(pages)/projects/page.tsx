"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { PAGE_SIZE, deleteProject, fetchProjects, postProject } from ".";
import { Project } from "@/app/types";
import { useSession } from "next-auth/react";
import CreateProjectDialog, { FormValues } from "./CreateProjectDialog";
import Link from "next/link";

function TableBody(
	data: Project[],
	currPageIndex: number,
	setOpenConfirmationDialog: (open: boolean) => void,
	setProjectToDelete: (project: Project) => void
) {
	const totalLength = data.length;
	const rows = [];

	if (totalLength === 0) {
		return (
			<tr className="border-b">
				<td colSpan={3} className="text-center">
					<p className="my-4">No Projects Found</p>
				</td>
			</tr>
		);
	}

	for (let i = currPageIndex; i < currPageIndex + PAGE_SIZE && i < totalLength; i++) {
		rows.push(
			<tr key={i} className="border-b">
				<td className="px-4 py-2">{data[i].name}</td>
				<td className="px-4 py-4">
					<p className="line-clamp-4">{data[i].description}</p>
				</td>
				<td className="px-4 py-2">
					<Link href={`/projects/${data[i]._id}`} className="btn btn-outline mr-4">
						Details
					</Link>
					<button
						onClick={() => {
							setProjectToDelete(data[i]);
							setOpenConfirmationDialog(true);
						}}
						className="btn btn-accent btn-outline"
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
				<h3 className="my-3 text-center text-xl sm:text-2xl">Delete Project</h3>
				<p className="mb-3">Are you sure you want to delete the project?</p>
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
	const { data: session } = useSession();

	const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}

		fetchProjects({
			userID: session?.user?.id,
		}).then((data) => {
			setProjects(data);
		});
	}, [session?.user?.id]);

	return (
		<div className="min-h-screen">
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
									<td className="flex flex-col items-center justify-end text-right transition-all ease-in-out sm:flex-row">
										<button
											disabled={pagesToShow === 0}
											className="btn btn-accent m-3 disabled:btn-neutral"
											onClick={() => setPagesToShow(pagesToShow - PAGE_SIZE)}
										>
											Previous Page
										</button>
										<button
											disabled={pagesToShow + PAGE_SIZE >= projects.length}
											className="btn btn-accent mb-3 disabled:btn-neutral sm:m-3"
											// className="mt-3 whitespace-nowrap rounded bg-teal-600 px-4 py-2 font-bold text-white transition-all ease-in-out hover:bg-teal-700 disabled:bg-gray-600"
											onClick={() => setPagesToShow(pagesToShow + PAGE_SIZE)}
										>
											Next Page
										</button>
									</td>
								</tr>
							</tfoot>
						</>
					)}
				</table>
				<CreateProjectDialog userID={session?.user.id} />
				<ConfirmationDialog
					projects={projects ?? []}
					open={openConfirmationDialog}
					setOpenDialog={setOpenConfirmationDialog}
					projectToDelete={projectToDelete}
				/>
			</div>
		</div>
	);
}
