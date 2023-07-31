import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();

	const res = await db
		.collection("assigned_users")
		.insertOne(data)
		.catch((err) => {
			return NextResponse.error();
		});

	return NextResponse.json(res);
}

export async function GET(request: NextRequest) {
	const assigneesId = request.nextUrl.searchParams.get("assigneesId");

	const client = await clientPromise;
	const db = client.db();

	const projects = await db
		.collection("assigned_users")
		.find({
			assigneesId: assigneesId,
		})
		.toArray();

	return NextResponse.json(projects);
}
