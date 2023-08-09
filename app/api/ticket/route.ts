import { Ticket } from "@/app/types";
import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const ticket: Ticket = await request.json();

	const result = await db.collection("tickets").insertOne(ticket);
	return NextResponse.json(result);
}
