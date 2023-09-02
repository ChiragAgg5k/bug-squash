import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const projectID = request.nextUrl.searchParams.get("projectID");

	const client = await clientPromise;
	const db = client.db();

	if (!projectID) {
		return NextResponse.error();
	}

	const projects = await db.collection("projects").findOne({
		_id: new ObjectId(projectID),
	});

	return NextResponse.json(projects);
}
