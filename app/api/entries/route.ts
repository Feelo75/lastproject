import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// 1. กำหนดกฎ Zod ตามโจทย์
const entrySchema = z.object({
  message: z.string().min(1, "กรุณาพิมพ์ข้อความอย่างน้อย 1 ตัว").max(300, "ข้อความยาวเกิน 300 ตัวอักษร"),
  mood: z.string().emoji("กรุณาเลือก Emoji อารมณ์"),
});

// 2. [C] - Create (บันทึกข้อมูล)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลด้วย Zod
    const validatedData = entrySchema.parse(body);

    // --- ส่วนดึง Weather API ---
    const API_KEY = "ใส่_API_KEY_ของคุณ_ตรงนี้"; // อย่าลืมสมัคร OpenWeatherMap นะครับ
    const city = "Phuket"; // สามารถเปลี่ยนเป็นเมืองที่ต้องการได้
    
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const weatherData = await weatherRes.json();

    // บันทึกลง Database
    const newEntry = await prisma.entry.create({
      data: {
        message: validatedData.message,
        mood: validatedData.mood,
        weatherCity: city,
        weatherTemp: weatherData.main ? weatherData.main.temp : 0,
        weatherDesc: weatherData.weather ? weatherData.weather[0].description : "ไม่ทราบสภาพอากาศ",
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 3. [R] - Read (ดึงข้อมูลไปแสดงไทม์ไลน์)
export async function GET() {
  const entries = await prisma.entry.findMany({
    orderBy: { createdAt: "desc" }, // เอาอันล่าสุดขึ้นก่อน
  });
  return NextResponse.json(entries);
}