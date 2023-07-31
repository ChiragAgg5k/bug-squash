import { AssignedUser, AssignedUserList } from "@/app/types";
import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const data = await request.json();

	const users = data.users as AssignedUserList[];
	const projectId = data.projectId;

	for (const user of users) {
		if (user.assigned) {
			const res = await db
				.collection("assigned_users")
				.updateOne({ _id: new ObjectId(user._id) }, { $push: { assignedProjects: projectId } })
				.catch((err) => {
					return NextResponse.error();
				});
		} else {
			const res = await db
				.collection("assigned_users")
				.updateOne({ _id: new ObjectId(user._id) }, { $pull: { assignedProjects: projectId } })
				.catch((err) => {
					return NextResponse.error();
				});
		}
	}

	return NextResponse.json(users);
}
