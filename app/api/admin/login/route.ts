import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'Admin' && password === 'PccAdmin') {
      const response = NextResponse.json({ success: true, role: 'admin' });

      response.cookies.set({
        name: 'admin-token',
        value: 'admin',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8 // 8 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
