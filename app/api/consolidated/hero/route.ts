import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const HERO_FILE = path.join(process.cwd(), 'public', 'hero.json');

export async function GET() {
  try {
    // Try DB first
    // @ts-ignore - in case hero model not generated yet
    if ((prisma as any)?.hero?.findFirst) {
      const hero = await (prisma as any).hero.findFirst({ orderBy: { updatedAt: 'desc' } });
      if (hero) return NextResponse.json(hero);
    }
  } catch (error) {
    console.error('Hero GET DB error:', error);
  }
  // Fallback to file (local dev only)
  try {
    const raw = await fs.readFile(HERO_FILE, 'utf8').catch(() => '');
    const data = raw ? JSON.parse(raw) : {};
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hero GET file error:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { image, heading, description, buyNowUrl, learnMoreUrl, productId } = body || {};
  // Try DB first
  try {
    // @ts-ignore - in case hero model not generated yet
    if ((prisma as any)?.hero?.create) {
      const created = await (prisma as any).hero.create({
        data: { image, heading, description, buyNowUrl, learnMoreUrl, productId }
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error('Hero POST DB error:', error);
  }
  // Fallback to file (local dev only)
  try {
    await fs.mkdir(path.dirname(HERO_FILE), { recursive: true });
    await fs.writeFile(HERO_FILE, JSON.stringify({ image, heading, description, buyNowUrl, learnMoreUrl, productId }, null, 2), 'utf8');
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Hero POST file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


