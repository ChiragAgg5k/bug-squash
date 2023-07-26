import clientPromise from "@/mongodb/config";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
	const session = await getServerSession();

	if (!session) {
		redirect("/api/auth/signin");
	}

	const client = await clientPromise;
	const db = client.db();
	const user = await db.collection("users").findOne({ email: session.user.email });

	if (!user) {
		return NextResponse.error();
	}
	const userID = user._id.toString();

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
		.catch((err) => {
			return NextResponse.error();
		});

	return NextResponse.json(project);
}
