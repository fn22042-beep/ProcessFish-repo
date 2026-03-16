import { NextResponse } from 'next/server';
import { ADMIN_TOKEN_NAME } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_SECRET) {
      const res = NextResponse.json({ success: true });
      // set cookie so middleware can validate admin
      res.cookies.set(ADMIN_TOKEN_NAME, process.env.ADMIN_SECRET ?? '', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return res;
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}