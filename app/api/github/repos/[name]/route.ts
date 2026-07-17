import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  return NextResponse.json(
    { message: `Repository ${name} not found` },
    { status: 404 }
  );
}
