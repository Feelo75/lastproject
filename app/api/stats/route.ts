import { NextResponse } from "next/server";
// เปลี่ยนบรรทัดนี้เพื่อถอยหลังออกจากโฟลเดอร์ app/api/stats ไปหา prisma นอกสุด
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const entries = await prisma.entry.findMany();

    // 1. นับจำนวนอารมณ์แต่ละแบบ
    const moodCounts: Record<string, number> = {};
    entries.forEach((item) => {
      if (item.mood) {
        moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
      }
    });

    // 2. นับจำนวนสภาพอากาศแต่ละแบบ
    const weatherCounts: Record<string, number> = {};
    entries.forEach((item) => {
      if (item.weatherDesc) {
        weatherCounts[item.weatherDesc] = (weatherCounts[item.weatherDesc] || 0) + 1;
      }
    });

    return NextResponse.json({
      totalEntries: entries.length,
      moodCounts,
      weatherCounts,
    });
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลสถิติไม่สำเร็จ" }, { status: 500 });
  }
}