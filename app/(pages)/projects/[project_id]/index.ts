import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";

export async function fetchProject({ projectId }: { projectId: string }) {
	const client = await clientPromise;
	const db = client.db();

	try {
		const project = await db.collection("projects").findOne({
			_id: new ObjectId(projectId),
		});

		return project;
	} catch (err) {
		return null;
	}
}
