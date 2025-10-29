import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
	try {
		const { notificationIds, userId } = await request.json();
		if (!Array.isArray(notificationIds) || !userId) {
			return NextResponse.json({ error: 'notificationIds[] and userId are required' }, { status: 400 });
		}
		await prisma.notification.deleteMany({ where: { id: { in: notificationIds }, userId } });
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Notifications bulk delete API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}



