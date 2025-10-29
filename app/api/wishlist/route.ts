import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const { userId, productId } = await request.json();
		if (!userId || !productId) return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
		const existing = await prisma.wishlist.findFirst({ where: { userId, productId } });
		if (existing) return NextResponse.json(existing);
		const created = await prisma.wishlist.create({ data: { userId, productId } });
		return NextResponse.json(created, { status: 201 });
	} catch (error) {
		console.error('Wishlist root POST Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { userId, productId } = await request.json();
		if (!userId || !productId) return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
		await prisma.wishlist.deleteMany({ where: { userId, productId } });
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Wishlist root DELETE Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}



