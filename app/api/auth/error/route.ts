import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  return NextResponse.json({
    error: error || 'Authentication error',
    message: 'Please try logging in again'
  });
}
