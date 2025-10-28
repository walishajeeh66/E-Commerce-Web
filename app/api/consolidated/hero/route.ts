import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const HERO_FILE = path.join(process.cwd(), 'public', 'hero.json');

export async function GET() {
  try {
    const raw = await fs.readFile(HERO_FILE, 'utf8').catch(() => '');
    const data = raw ? JSON.parse(raw) : {};
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hero GET error:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await fs.writeFile(HERO_FILE, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Hero POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


