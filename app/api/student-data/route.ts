import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import StData from '@/models/StData';

// Parse OS and Browser from User-Agent string
function parseUserAgent(ua: string) {
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let device = 'Desktop';

  // OS Detection
  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  // Browser Detection
  if (/Edg\//.test(ua)) browser = 'Microsoft Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Google Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  // Device Detection
  if (/Mobile|Android|iPhone/.test(ua)) device = 'Mobile';
  else if (/iPad|Tablet/.test(ua)) device = 'Tablet';

  return { os, browser, device };
}

export async function GET() {
  try {
    await connectDB();
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

    // Capture device info from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') ?? 'Unknown');
    const userAgent = request.headers.get('user-agent') ?? '';
    const { os, browser, device } = parseUserAgent(userAgent);

    body.submittedDevice = { ip, os, browser, device, userAgent };

    const newStudentData = new StData(body);
    await newStudentData.save();
    return NextResponse.json({ success: true, data: newStudentData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
