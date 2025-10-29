import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get('file') as File | null;
		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult: any = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: 'products' },
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(buffer);
		});

		return NextResponse.json(uploadResult);
	} catch (err) {
		console.error('Cloudinary upload failed', err);
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
	}
}



