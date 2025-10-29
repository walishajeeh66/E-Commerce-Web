import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId, title, message, type, priority = 'NORMAL', metadata } = body || {};
		if (!userId || !title || !message || !type) {
			return NextResponse.json({ error: 'userId, title, message, type are required' }, { status: 400 });
		}
		const created = await prisma.notification.create({
			data: { userId, title, message, type, priority, metadata }
		});
		return NextResponse.json(created, { status: 201 });
	} catch (error) {
		console.error('Notification create API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { id, isRead } = body || {};
		if (!id || typeof isRead !== 'boolean') {
			return NextResponse.json({ error: 'id and isRead are required' }, { status: 400 });
		}
		const updated = await prisma.notification.update({ where: { id }, data: { isRead } });
		return NextResponse.json(updated);
	} catch (error) {
		console.error('Notification update API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}



