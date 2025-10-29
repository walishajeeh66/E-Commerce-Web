import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List notifications for a user (id treated as userId)
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params; // userId
		if (!id) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limitParam = searchParams.get('limit') || searchParams.get('pageSize');
		const pageSize = parseInt(limitParam || '10');
		const type = searchParams.get('type') || undefined;
		const priority = searchParams.get('priority') || undefined;
		const readParam = searchParams.get('isRead');
		const isRead = typeof readParam === 'string' ? readParam === 'true' : undefined;
		const search = searchParams.get('search') || undefined;
		const sortBy = searchParams.get('sortBy') || 'createdAt';
		const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

		const where: any = { userId: id };
		if (typeof isRead === 'boolean') where.isRead = isRead;
		if (type) where.type = type as any;
		if (priority) where.priority = priority as any;
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: 'insensitive' } },
				{ message: { contains: search, mode: 'insensitive' } }
			];
		}

		const total = await prisma.notification.count({ where });
		const unreadCount = await prisma.notification.count({ where: { userId: id, isRead: false } });
		const items = await prisma.notification.findMany({
			where,
			orderBy: { [sortBy]: sortOrder },
			skip: (page - 1) * pageSize,
			take: pageSize
		});

		return NextResponse.json({ 
			notifications: items, 
			unreadCount,
			total, 
			page, 
			totalPages: Math.max(1, Math.ceil(total / pageSize)) 
		});
	} catch (error) {
		console.error('Notifications list API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT: Update single notification (id is notification id)
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { isRead } = await request.json();
		if (!id || typeof isRead !== 'boolean') {
			return NextResponse.json({ error: 'id and isRead are required' }, { status: 400 });
		}
		const updated = await prisma.notification.update({ where: { id }, data: { isRead } });
		return NextResponse.json(updated);
	} catch (error) {
		console.error('Notification single update API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE: Delete single notification (id is notification id)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { userId } = await request.json();
		if (!id || !userId) {
			return NextResponse.json({ error: 'id and userId are required' }, { status: 400 });
		}
		await prisma.notification.delete({ where: { id } });
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Notification delete API Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


