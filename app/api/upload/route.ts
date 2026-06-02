import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const DOC_TYPES   = ['application/pdf'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...DOC_TYPES];

const IMAGE_MAX = 5  * 1024 * 1024; // 5 MB
const DOC_MAX   = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF, or PDF allowed.' }, { status: 400 });

  const maxSize = DOC_TYPES.includes(file.type) ? DOC_MAX : IMAGE_MAX;
  if (file.size > maxSize)
    return NextResponse.json(
      { error: `File must be under ${maxSize / 1024 / 1024} MB.` },
      { status: 400 },
    );

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
