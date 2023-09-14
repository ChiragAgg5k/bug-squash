import clientPromise from "@/mongodb/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email")?.trim();
	if (!email || email === undefined) return NextResponse.error();

	const client = await clientPromise;
	const db = client.db();

	const res = await db
		.collection("users")
		.aggregate([
			{
				$search: {
					index: "autocomplete",
					autocomplete: {
						query: email,
						path: "email",
						fuzzy: {
							maxEdits: 1,
						},
						tokenOrder: "sequential",
					},
				},
			},
		])
		.toArray();

	return NextResponse.json(res);
}
