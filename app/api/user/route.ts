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
