import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    credentials: {
      id: "credentials",
      name: "Credentials",
      type: "credentials"
    }
  });
}
