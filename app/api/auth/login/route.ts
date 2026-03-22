import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let role = null;

    if (username === 'principal' && password === 'admin') {
      role = 'principal';
    } else if (username === 'teacher' && password === 'teacherpass') {
      role = 'teacher';
    }

    if (!role) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, role });
    
    // Set secure HTTPOnly cookie
    response.cookies.set({
      name: 'auth-token',
      value: role,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Set a secondary cookie accessible by JS for UI logic
    response.cookies.set({
      name: 'user-role',
      value: role,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
