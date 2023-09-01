import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userID = request.nextUrl.searchParams.get("userID");

	const client = await clientPromise;
	const db = client.db();

	const projects = await db
		.collection("projects")
		.find({
			userID: userID,
		})
		.toArray();

	return NextResponse.json(projects);
}

export async function POST(request: Request) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();

	const project = await db
		.collection("projects")
		.insertOne(data)
		.catch(() => {
			return NextResponse.error();
		});

	return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const projectId = request.nextUrl.searchParams.get("projectId");

	if (!projectId) {
		return NextResponse.error();
	}

	const project = await db
		.collection("projects")
		.deleteOne({ _id: new ObjectId(projectId) })
		.catch(() => {
			return NextResponse.error();
		});

	return NextResponse.json(project);
}
