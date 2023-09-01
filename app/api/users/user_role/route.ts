import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userID = request.nextUrl.searchParams.get("userID");
	const assignedID = request.nextUrl.searchParams.get("assignedID");

	if (!userID || userID === undefined || !assignedID || assignedID === undefined) return NextResponse.error();

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection("users").findOne({
		_id: new ObjectId(userID),
	});
	if (!user) return NextResponse.error();

	const assignedUsers = user.assignedUsers;
	for (let i = 0; i < assignedUsers.length; i++) {
		const obj = JSON.parse(JSON.stringify(assignedUsers[i]));
		if (Object.keys(obj)[0] == assignedID) return NextResponse.json(obj[assignedID]);
	}

	return NextResponse.error();
}
