import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'user'
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
