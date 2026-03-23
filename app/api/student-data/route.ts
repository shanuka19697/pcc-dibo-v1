import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import StData from '@/models/StData';

// Parse OS, Browser, and Device Model from User-Agent
function parseUserAgent(ua: string) {
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let device = 'Desktop';
  let deviceModel = 'Unknown';

  // OS Detection
  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
  else if (/Mac OS X ([\d_]+)/.test(ua)) {
    const ver = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '';
    os = `macOS ${ver}`;
  } else if (/Android ([\d.]+)/.test(ua)) {
    const ver = ua.match(/Android ([\d.]+)/)?.[1] ?? '';
    os = `Android ${ver}`;
  } else if (/iPhone OS ([\d_]+)/.test(ua)) {
    const ver = ua.match(/iPhone OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '';
    os = `iOS ${ver}`;
  } else if (/iPad.*OS ([\d_]+)/.test(ua)) {
    const ver = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') ?? '';
    os = `iPadOS ${ver}`;
  } else if (/Linux/.test(ua)) os = 'Linux';

  // Browser Detection (order matters)
  if (/Edg\//.test(ua)) browser = 'Microsoft Edge';
  else if (/OPR\/([\d.]+)/.test(ua)) browser = `Opera ${ua.match(/OPR\/([\d.]+)/)?.[1] ?? ''}`;
  else if (/Chrome\/([\d.]+)/.test(ua) && !/Chromium/.test(ua)) browser = `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]?.split('.')[0] ?? ''}`;
  else if (/Firefox\/([\d.]+)/.test(ua)) browser = `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1]?.split('.')[0] ?? ''}`;
  else if (/Safari\/([\d.]+)/.test(ua)) browser = 'Safari';
  else if (/Chromium\/([\d.]+)/.test(ua)) browser = 'Chromium';

  // Device type + model
  if (/iPad/.test(ua)) {
    device = 'Tablet';
    deviceModel = 'Apple iPad';
  } else if (/iPhone/.test(ua)) {
    device = 'Mobile';
    deviceModel = 'Apple iPhone';
  } else if (/Android/.test(ua)) {
    if (/Tablet|Tab/.test(ua)) {
      device = 'Tablet';
    } else {
      device = 'Mobile';
    }
    // Try to extract model (e.g. SM-G991B, Pixel 6)
    const modelMatch = ua.match(/;\s*([A-Za-z0-9\s\-]+)\sBuild\//);
    deviceModel = modelMatch?.[1]?.trim() ?? 'Android Device';
  } else if (/Mobile/.test(ua)) {
    device = 'Mobile';
    deviceModel = 'Mobile Device';
  } else {
    device = 'Desktop';
    deviceModel = 'Desktop/Laptop';
  }

  return { os, browser, device, deviceModel };
}

// Fetch geolocation info from ip-api.com (free, no API key)
async function getGeoInfo(ip: string) {
  try {
    // Skip lookup for local/private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.')) {
      return { isp: 'Local Network', org: 'Local', country: 'Local', region: 'Local', city: 'Local', timezone: 'Local' };
    }
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone,isp,org,as`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    const data = await res.json();
    if (data.status === 'success') {
      return {
        isp: data.isp ?? 'Unknown',
        org: data.org ?? data.as ?? 'Unknown',
        country: data.country ?? 'Unknown',
        region: data.regionName ?? 'Unknown',
        city: data.city ?? 'Unknown',
        timezone: data.timezone ?? 'Unknown',
      };
    }
  } catch {
    // Silently fail — don't block submission
  }
  return { isp: 'Unknown', org: 'Unknown', country: 'Unknown', region: 'Unknown', city: 'Unknown', timezone: 'Unknown' };
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

    // Capture IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') ?? '127.0.0.1');
    const userAgent = request.headers.get('user-agent') ?? '';

    const { os, browser, device, deviceModel } = parseUserAgent(userAgent);
    const geo = await getGeoInfo(ip);

    body.submittedDevice = { ip, os, browser, device, deviceModel, userAgent, ...geo };

    const newStudentData = new StData(body);
    await newStudentData.save();
    return NextResponse.json({ success: true, data: newStudentData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
