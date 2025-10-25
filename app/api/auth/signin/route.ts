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
    
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
