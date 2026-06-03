import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const IMAGE_TYPES   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const DOC_TYPES     = ['application/pdf'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...DOC_TYPES];

const IMAGE_MAX = 5  * 1024 * 1024; // 5 MB
const DOC_MAX   = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  // Give a clear error if the Blob store token is not configured yet
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'File upload is not configured. Please link the Vercel Blob store to this project in the Vercel dashboard.' },
      { status: 503 },
    );
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file)
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json(
      { error: 'Only JPG, PNG, WebP, GIF, or PDF allowed.' },
      { status: 400 },
    );

  const maxSize = DOC_TYPES.includes(file.type) ? DOC_MAX : IMAGE_MAX;
  if (file.size > maxSize)
    return NextResponse.json(
      { error: `File must be under ${maxSize / 1024 / 1024} MB.` },
      { status: 400 },
    );

  const ext      = file.name.split('.').pop() ?? 'bin';
  const filename = `uploads/${Date.now()}.${ext}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
