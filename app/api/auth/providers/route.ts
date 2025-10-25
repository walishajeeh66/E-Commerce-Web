import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      providers: [
        {
          id: "credentials",
          name: "Credentials",
          type: "credentials"
        }
      ],
      session: session ? {
        user: (session as any).user,
        expires: (session as any).expires
      } : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get providers" },
      { status: 500 }
    );
  }
}
