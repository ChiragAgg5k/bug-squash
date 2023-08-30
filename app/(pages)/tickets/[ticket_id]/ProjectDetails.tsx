"use client";

import { useEffect, useState } from "react";
import { fetchSingleProject } from "..";
import { Project } from "@/app/types";
import Link from "next/link";

export default function ProjectDetails({ projectID }: { projectID: string }) {
	const [project, setProject] = useState<Project | undefined>(undefined);

	useEffect(() => {
		fetchSingleProject({
			projectID: projectID,
		}).then((project) => {
			setProject(project);
		});
	}, [projectID]);

	return (
		<span className="flex">
			<p className="mr-8">
				<span className="mr-2 underline">Project :</span> {project ? project.name : "Loading..."}
			</p>

			<Link href={`/projects/${project?._id}`} className="text-teal-500 hover:underline">
				Go to project page
			</Link>
		</span>
	);
}
