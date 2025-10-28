import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('uploadedFile');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'uploadedFile is required' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadDir = path.join(process.cwd(), 'public');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);

    await fs.writeFile(filePath, bytes);

    // Invalidate any CDN cache by setting cache-control headers
    const res = NextResponse.json({ filename: safeName, path: `/${safeName}` });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (error) {
    console.error('Main image upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


