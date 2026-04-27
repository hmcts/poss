import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!process.env.ACCESS_CODE) {
    return NextResponse.json({ error: 'ACCESS_CODE not configured' }, { status: 500 });
  }

  if (code !== process.env.ACCESS_CODE) {
    return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('statesmith_access', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}
