import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema for validation
const entrySchema = z.object({
  message: z.string().min(1, "กรุณาพิมพ์ข้อความอย่างน้อย 1 ตัว").max(300, "ข้อความยาวเกิน 300 ตัวอักษร"),
  mood: z.string(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

// Helper function to get weather data
async function getWeatherData(lat?: number, lon?: number, city?: string) {
  const API_KEY = "fa4def56fd7f671cc616e89a505b4cfe";
  
  let url: string;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  } else {
    const defaultCity = city || "Phuket";
    url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=metric&appid=${API_KEY}`;
  }
  
  try {
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();
    
    if (weatherData.main && weatherData.weather) {
      return {
        city: weatherData.name || defaultCity || "Phuket",
        temp: weatherData.main.temp,
        desc: weatherData.weather[0].description,
      };
    }
  } catch (error) {
    console.error("Weather API error:", error);
  }
  
  // Fallback data
  return {
    city: "Phuket",
    temp: 28,
    desc: "clear sky",
  };
}

// POST - Create entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate data
    const validatedData = entrySchema.parse(body);
    
    // Get weather data (with or without coordinates)
    const weather = await getWeatherData(validatedData.lat, validatedData.lon);
    
    // Save to database
    const newEntry = await prisma.entry.create({
      data: {
        message: validatedData.message,
        mood: validatedData.mood,
        weatherCity: weather.city,
        weatherTemp: weather.temp,
        weatherDesc: weather.desc,
      },
    });
    
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET - Read all entries
export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}