import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const projectId = request.nextUrl.searchParams.get("projectID");

	if (!projectId || projectId === undefined) return NextResponse.error();

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

export async function POST(request: Request) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();
	const projectId = data.projectID;
	const userID = data.userID;

	const project = await db
		.collection("projects")
		.updateOne(
			{ _id: new ObjectId(projectId) },
			{
				$addToSet: {
					userIDs: userID,
				},
			}
		)
		.catch((err) => {
			return NextResponse.error();
		});

	return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
	const projectID = request.nextUrl.searchParams.get("projectID");
	const userID = request.nextUrl.searchParams.get("userID");

	if (!projectID || !userID) return NextResponse.error();

	const client = await clientPromise;
	const db = client.db();

	const project = await db
		.collection("projects")
		.updateOne(
			{ _id: new ObjectId(projectID) },
			{
				$pull: {
					userIDs: userID,
				},
			}
		)
		.catch((err) => {
			return NextResponse.error();
		});

	return NextResponse.json(project);
}
