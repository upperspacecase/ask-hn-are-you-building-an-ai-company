import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Prototype capture: no database on this MVP. The signup is the test signal,
  // so we log it to the serverless function logs for review.
  console.log("[waitlist]", JSON.stringify({ email }));

  return NextResponse.json({ ok: true });
}
