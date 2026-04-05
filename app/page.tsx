'use client'
import { useEffect, useState } from 'react';

interface Entry {
  id: string;
  createdAt: string;
  message: string;
  mood: string;
  weatherCity: string;
  weatherTemp: number;
  weatherDesc: string;
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/api/entries')
      .then((res) => res.json())
      .then((data) => setEntries(data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#333] mb-6">🗓️ Timeline ของฉัน</h1>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-amber-200">
        {entries.map((entry) => (
          <div key={entry.id} className="relative pl-12">
            {/* วงกลมอารมณ์บนเส้น Timeline */}
            <div className="absolute left-1 bg-white border-2 border-amber-400 w-9 h-9 rounded-full flex items-center justify-center text-xl">
              {entry.mood}
            </div>
            
            {/* กล่องข้อความ */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <span className="text-xs text-gray-500">
                {new Date(entry.createdAt).toLocaleString('th-TH')}
              </span>
              <p className="text-lg font-medium text-gray-800 mt-1">{entry.message}</p>
              
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                📍 <span>{entry.weatherCity}</span> | ⛅ <span>{entry.weatherDesc}</span> | 🌡️ <span>{entry.weatherTemp.toFixed(1)}°C</span>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-gray-500">ยังไม่มีบันทึกเลย ลองเพิ่มดูสิ!</p>
        )}
      </div>
    </div>
  );
}