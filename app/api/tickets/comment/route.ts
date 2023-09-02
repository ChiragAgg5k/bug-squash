import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const data = await request.json();
	const { ticketID, comment, userID, time } = data;

	const client = await clientPromise;
	const db = client.db();

	const response = await db
		.collection("tickets")
		.updateOne(
			{ _id: new ObjectId(ticketID) },
			{
				$addToSet: {
					comments: {
						comment,
						userID,
						time,
					},
				},
			}
		)
		.catch(() => {
			return NextResponse.error();
		});

	return NextResponse.json(response);
}
