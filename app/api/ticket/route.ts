import { Ticket, TicketWithoutID } from "@/app/types";
import clientPromise from "@/mongodb/config";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const ticket: TicketWithoutID = await request.json();

	const result = await db.collection("tickets").insertOne(ticket);
	return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
	const ticketID = request.nextUrl.searchParams.get("ticketID");

	if (!ticketID) {
		return NextResponse.next();
	}

	const client = await clientPromise;
	const db = client.db();

	const ticket = await db.collection("tickets").findOne({
		_id: new ObjectId(ticketID),
	});

	return NextResponse.json(ticket);
}
