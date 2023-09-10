"use client";
import React, { useState } from "react";
import { PAGE_SIZE } from ".";
import { Project } from "@/app/types";
import { useSession } from "next-auth/react";
import CreateProjectDialog from "./CreateProjectDialog";
import Link from "next/link";
import ConfirmDeleteProject from "./ConfirmDeleteProject";
import useSWR from "swr";

/* eslint-disable */
function TableBody(data: Project[], currPageIndex: number, setProjectToDelete: (project: Project) => void) {
	const totalLength = data.length;
	const rows = [];

	if (totalLength === 0) {
		return (
			<tr className="border-b border-gray-700 dark:border-gray-300">
				<td colSpan={3} className="text-center">
					<p className="my-4">No Projects Found</p>
				</td>
			</tr>
		);
	}

	for (let i = currPageIndex; i < currPageIndex + PAGE_SIZE && i < totalLength; i++) {
		rows.push(
			<tr key={i} className="border-b border-gray-700 dark:border-gray-500">
				<td className="px-4 py-2">{data[i].name}</td>
				<td className="px-4 py-4">
					<p className="line-clamp-4">{data[i].description}</p>
				</td>
				<td className="px-4 py-2">
					<Link href={`/projects/${data[i]._id}`} className="btn btn-neutral dark:btn-outline mr-4">
						Details
					</Link>
					<button
						className="btn btn-accent m-2 ml-2 dark:btn-outline"
						onClick={() => {
							setProjectToDelete(data[i]);
							(window as any).confirm_delete_project_modal.showModal();
						}}
					>
						Delete
					</button>
				</td>
			</tr>
		);
	}

	return rows;
}

function AssignedProjectsTableBody(
	data: Project[],
	currPageIndex: number,
	setProjectToDelete: (project: Project) => void
) {
	const totalLength = data.length;
	const rows = [];

	if (totalLength === 0) {
		return (
			<tr className="border-b border-gray-700 dark:border-gray-300">
				<td colSpan={3} className="text-center">
					<p className="my-4">You are not assigned to any projects</p>
				</td>
			</tr>
		);
	}

	for (let i = currPageIndex; i < currPageIndex + PAGE_SIZE && i < totalLength; i++) {
		rows.push(
			<tr key={i} className="border-b border-gray-700 dark:border-gray-500">
				<td className="px-4 py-2">{data[i].name}</td>
				<td className="px-4 py-4">
					<p className="line-clamp-4">{data[i].description}</p>
				</td>
				<td className="px-4 py-2">
					<Link href={`/projects/${data[i]._id}`} className="btn btn-neutral dark:btn-outline mr-4">
						Details
					</Link>
				</td>
			</tr>
		);
	}

	return rows;
}

function LoadingTable() {
	return (
		<tbody>
			<tr className="border-b border-gray-700 dark:border-gray-300">
				<td colSpan={3} className="text-center">
					<p className="my-4">Loading...</p>
				</td>
			</tr>
		</tbody>
	);
}

export default function ProjectsPage() {
	const [pagesToShow, setPagesToShow] = useState(0);
	const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
	const { data: session } = useSession();
	const { data: projects } = useSWR<Project[] | undefined>(
		`/api/projects?userID=${session?.user.id}`,
		async (url) => {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		}
	);

	const { data: assigned_projects } = useSWR<Project[] | undefined>(
		`/api/projects/assigned-projects?userID=${session?.user.id}`,
		async (url) => {
			const res = await fetch(url);
			const data = await res.json();
			return data;
		}
	);

	return (
		<>
			<h1 className="mb-4 text-2xl">Your Projects</h1>
			<p>All of your projects are listed here:</p>
			<div className="overflow-x-auto">
				<table className="mt-6 w-full border-b border-gray-700 dark:border-gray-300">
					<thead>
						<tr className="border-b border-gray-700 dark:border-gray-300">
							<th className="px-4 py-4">Name</th>
							<th className="px-4 py-4">Description</th>
							<th className="px-4 py-4">Operations</th>
						</tr>
					</thead>

					{projects === undefined ? (
						<LoadingTable />
					) : (
						<>
							<tbody>{TableBody(projects, pagesToShow, setProjectToDelete)}</tbody>
							<tfoot>
								<tr>
									<td colSpan={2}>
										Current Page: {Math.floor(pagesToShow / PAGE_SIZE) + 1} of{" "}
										{Math.ceil(projects.length / PAGE_SIZE) || 1}
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
			</div>
			<CreateProjectDialog userID={session?.user.id} />
			<ConfirmDeleteProject projectToDelete={projectToDelete} />

			<h2 className="mb-4 text-2xl">Projects Assigned to You</h2>
			<p>These are projects that you are assigned to. You can view them, but you cannot delete them.</p>

			<div className="mb-24 overflow-x-auto">
				<table className="mt-6 w-full border-b border-gray-700 dark:border-gray-300">
					<thead>
						<tr className="border-b border-gray-700 dark:border-gray-300">
							<th className="px-4 py-4">Name</th>
							<th className="px-4 py-4">Description</th>
							<th className="px-4 py-4">Operations</th>
						</tr>
					</thead>

					{assigned_projects === undefined ? (
						<LoadingTable />
					) : (
						<tbody>{AssignedProjectsTableBody(assigned_projects, 0, setProjectToDelete)}</tbody>
					)}
				</table>
			</div>
		</>
	);
}
