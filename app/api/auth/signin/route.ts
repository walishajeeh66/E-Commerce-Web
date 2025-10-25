import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    const session = await getServerSession(authOptions);
    
    if (session) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    
    // Return JSON response instead of redirecting to login
    return NextResponse.json({
      message: "Signin endpoint",
      callbackUrl: callbackUrl,
      providers: [
        {
          id: "credentials",
          name: "Credentials",
          type: "credentials"
        }
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Signin error" },
      { status: 500 }
    );
  }
}
