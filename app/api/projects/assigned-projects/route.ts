import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userID = request.nextUrl.searchParams.get("userID");

	if (!userID) {
		return NextResponse.next();
	}

	const client = await clientPromise;
	const db = client.db();

	const projects = await db
		.collection("projects")
		.find({
			userIDs: userID,
		})
		.toArray();

	return NextResponse.json(projects);
}
