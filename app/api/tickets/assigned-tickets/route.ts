import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const projectID = request.nextUrl.searchParams.get("projectID");

	const tickets = await db.collection("tickets").find({ projectID: projectID }).toArray();

	return NextResponse.json(tickets);
}
