import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "If you can see this, API routes are working",
    timestamp: new Date().toISOString(),
  });
}
