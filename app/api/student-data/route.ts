import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import StData from '@/models/StData';

export async function GET() {
  try {
    await connectDB();
    // Fetch all fields including the new ultra-fast ImageKit URLs
    const studentData = await StData.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: studentData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Receiving new student data:", body);
    const newStudentData = new StData(body);
    await newStudentData.save();
    return NextResponse.json({ success: true, data: newStudentData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
