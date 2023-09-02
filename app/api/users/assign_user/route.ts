import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();
	const assigneesId = data.assigneesId;
	const assignedId = data.assignedId;
	const role = data.role;

	const dataToInsert = {
		[assignedId]: role,
	};

	const res = await db
		.collection("users")
		.updateOne({ _id: new ObjectId(assigneesId) }, { $addToSet: { assignedUsers: dataToInsert } })
		.catch(() => {
			return NextResponse.error();
		});

	return NextResponse.json(res);
}

export async function GET(request: NextRequest) {
	const assigneesId = request.nextUrl.searchParams.get("assigneesId")?.trim();
	if (!assigneesId || assigneesId === undefined) return NextResponse.error();

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection("users").findOne({ _id: new ObjectId(assigneesId) });
	const assignedUsers = user?.assignedUsers;
	return NextResponse.json(assignedUsers);
}

export async function DELETE(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get("userId")?.trim();
	const userToDeleteId = request.nextUrl.searchParams.get("userToDeleteId")?.trim();

	if (!userId || !userToDeleteId) {
		return NextResponse.error();
	}

	const client = await clientPromise;
	const db = client.db();

	const res = await db
		.collection("users")
		.updateOne({ _id: new ObjectId(userId) }, { $pull: { assignedUsers: { [userToDeleteId]: { $exists: true } } } })
		.catch(() => {
			return NextResponse.error();
		});

	return NextResponse.json(res);
}
