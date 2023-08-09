import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const client = await clientPromise;
	const db = client.db();

	const userID = request.nextUrl.searchParams.get("userID");

	const tickets = await db.collection("tickets").find({ userID }).toArray();

	return NextResponse.json(tickets);
}
