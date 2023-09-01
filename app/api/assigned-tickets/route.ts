import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

// {
//   "_id": {
//     "$oid": "64eee04fd205e1e07a8e3465"
//   },
//   "userID": "64eedd0e70135bab8e7695bd",
//   "heading": "Demo Ticket",
//   "description": "This is a demo ticket. You can create your own by clicking the button below. There is a lot of customization for each ticket!",
//   "projectID": "64eee015d205e1e07a8e3464",
//   "type": "documentation",
//   "priority": "urgent",
//   "status": "open",
//   "assignedUsers": [],
//   "comments": [
//     {
//       "comment": "Yo this is a cool ticket. Please don't resolve it :/",
//       "userID": "64eedd0e70135bab8e7695bd",
//       "time": "2023-08-30T18:02:17.072Z"
//     },
//     {
//       "comment": "Nice ticket man. Hope the project is doing alright. Don't worrry, Only YOU can resolve it since you are the owner.",
//       "userID": "64be20ff5417e9dbd69ca275",
//       "time": "2023-08-30T18:03:35.912Z"
//     }
//   ]
// }
export async function GET(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const projectID = request.nextUrl.searchParams.get("projectID");

	const tickets = await db.collection("tickets").find({ projectID: projectID }).toArray();

	return NextResponse.json(tickets);
}
