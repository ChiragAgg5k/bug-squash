import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getServerSession();
	if (!session)
		return NextResponse.json({
			error: "You must be sign in to view the protected content on this page.",
		});

	const userID = request.nextUrl.searchParams.get("userID");
	if (!userID || userID === undefined) return NextResponse.error();

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection("users").findOne({ _id: new ObjectId(userID) });

	return NextResponse.json(user);
}

// MongoServerError: Cannot create field '64be7657c572c58a9eeca8bd' in element {assignedUsers: [ { 64be7657c572c58a9eeca8bd: "Admin" }, { 64ccf539ef8fff1e8f0a5005: "Tester" }, { 64ccf608ef8fff1e8f0a5007: "Tester" }, { 64d1cf742422c0f8cd09c8a4: "Manager" }, { 64d1d159dff7052de0b3bf90: "Manager" } ]}
// {
//   "_id": {
//     "$oid": "64be20ff5417e9dbd69ca275"
//   },
//   "name": "Chirag Aggarwal",
//   "email": "chiragaggarwal5k@gmail.com",
//   "image": "https://avatars.githubusercontent.com/u/110609663?v=4",
//   "emailVerified": null,
//   "assignedUsers": [
//     {
//       "64be7657c572c58a9eeca8bd": "Admin"
//     },
//     {
//       "64ccf539ef8fff1e8f0a5005": "Tester"
//     },
//     {
//       "64ccf608ef8fff1e8f0a5007": "Tester"
//     },
//     {
//       "64d1cf742422c0f8cd09c8a4": "Manager"
//     },
//     {
//       "64d1d159dff7052de0b3bf90": "Manager"
//     }
//   ]
// }
export async function POST(request: NextRequest) {
	const  session = await getServerSession();
	if (!session)
		return NextResponse.json({
			error: "You must be sign in to view the protected content on this page.",
		});

	const data = await request.json();
	const { userId, assignedUserId, roleToModify } = data;

	const client = await clientPromise;
	const db = client.db();

	const res = await db
		.collection("users")
		.updateOne({ _id: new ObjectId(userId) }, { $pull: { assignedUsers: { [assignedUserId]: { $exists: true } } } })
		.catch((err) => {
			return NextResponse.error();
		});

	const dataToInsert = {
		[assignedUserId]: roleToModify,
	};

	const response = await db
		.collection("users")
		.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { assignedUsers: dataToInsert } })
		.catch((err) => {
			return NextResponse.error();
		});

	return NextResponse.json(response);
}