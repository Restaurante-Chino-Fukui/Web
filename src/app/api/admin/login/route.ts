import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submittedPassword = typeof body.password === 'string' ? body.password : '';
    const adminPassword = process.env.ADMIN_PASSWORD ?? process.env.password ?? process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'fukuiadmin';

    if (submittedPassword !== adminPassword) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
