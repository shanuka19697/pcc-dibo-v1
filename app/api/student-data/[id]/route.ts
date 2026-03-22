import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import StData from '@/models/StData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await connectDB();
    const student = await StData.findById(resolvedParams.id);
    if (!student) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const role = cookieStore.get('auth-token')?.value;

    await connectDB();
    const body = await request.json();
    console.log("Updating student data:", body);

    // Secure permissions: Teachers cannot toggle Active/Inactive statuses
    if (role === 'teacher' && 'Isactive' in body) {
      delete body.Isactive;
    }

    const updated = await StData.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('auth-token')?.value;

    // Only principals can delete
    if (role !== 'principal') {
       return NextResponse.json({ success: false, message: 'Forbidden. Principal account required.' }, { status: 403 });
    }

    const resolvedParams = await params;
    await connectDB();
    await StData.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
