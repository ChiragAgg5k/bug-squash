import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return NextResponse.json({
    authenticated: !!session,
  });
}
