import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_TOKEN_NAME } from './constants';

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_NAME);
  const isValid = token?.value === process.env.ADMIN_SECRET;
  if (!isValid) {
    redirect('/admin/login');
  }
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_NAME, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}