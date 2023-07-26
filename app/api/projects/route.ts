import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
	const client = await clientPromise;
	const db = client.db();
	const projects = await db.collection("projects").find().toArray();

	return NextResponse.json(projects);
}

export async function POST(request: Request) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();

	const project = await db
		.collection("projects")
		.insertOne(data)
		.catch((err) => {
			console.error(err);
			return NextResponse.error();
		});

	return NextResponse.json(project);
}
