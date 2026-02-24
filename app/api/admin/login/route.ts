import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    console.log('Received password:', password);
    console.log('Env secret:', process.env.ADMIN_SECRET);
    
    if (password === process.env.ADMIN_SECRET) {
      await setAuthCookie();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}