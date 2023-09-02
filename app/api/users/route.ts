import clientPromise from "@/mongodb/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line
export async function GET(request: NextRequest) {
	const session = await getServerSession();
	if (!session)
		return NextResponse.json({
			error: "You must be sign in to view the protected content on this page.",
		});

	const client = await clientPromise;
	const db = client.db();

	const projects = await db.collection("users").find({}).toArray();

	return NextResponse.json(projects);
}
