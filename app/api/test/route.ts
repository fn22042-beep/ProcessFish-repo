import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    secret: process.env.ADMIN_SECRET,
    exists: !!process.env.ADMIN_SECRET 
  });
}