import { NextResponse } from "next/server";

export async function POST() {
  // Simple logging endpoint for NextAuth
  return NextResponse.json({ 
    message: "Auth log endpoint",
    timestamp: new Date().toISOString()
  });
}
