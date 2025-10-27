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

    return NextResponse.json({
      message: "Admin Setup API",
      instructions: "Use POST method to create admin user",
      example: {
        method: "POST",
        body: {
          email: "admin@example.com",
          password: "admin123456"
        }
      },
      currentUsers: users
    });
  } catch (error) {
    console.error('Admin Setup API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      user
    });
  } catch (error) {
    console.error('Admin Setup API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
