import mongoose from 'mongoose';
import connectDB from './lib/db';
import StData from './models/StData';
import dotenv from 'dotenv';
import path from 'path';

// Force load env from .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkData() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await connectDB();
    const students = await StData.find().sort({ createdAt: -1 }).limit(10).lean();
    console.log("Latest 10 Students:");
    students.forEach(s => {
      console.log(`- ${s.StudentName}: Gender='${s.Gender}', Isactive=${s.Isactive}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
