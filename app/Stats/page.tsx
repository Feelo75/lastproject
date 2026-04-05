'use client'
import { useState, useEffect } from 'react';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-pulse text-xl text-gray-600">กำลังคำนวณสถิติ...</div>
    </div>
  );
  
  if (!stats || stats.totalEntries === 0) return (
    <div className="text-center p-10 bg-white rounded-xl shadow-sm max-w-md mx-auto mt-10 border">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-xl font-bold mb-2">ยังไม่มีบันทึกเลย</h3>
      <p className="text-gray-500">ลองไปเพิ่มข้อมูลอารมณ์ของคุณที่หน้าแรกก่อนนะ!</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center text-[#333]">📊 สถิติภาพรวมของคุณ</h1>
      <p className="text-center mb-8 text-gray-500">บันทึกทั้งหมด <span className="font-bold text-amber-600">{stats.totalEntries}</span> ครั้ง</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* กล่องสถิติอารมณ์ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🎭 อารมณ์ยอดฮิต</h2>
          <div className="space-y-4">
            {Object.entries(stats.moodCounts).map(([mood, count]: any) => {
              const percent = Math.round((count / stats.totalEntries) * 100);
              return (
                <div key={mood}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-2xl">{mood}</span>
                    <span className="text-sm font-medium text-gray-600">{count} ครั้ง ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* กล่องสถิติสภาพอากาศ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🌦️ สภาพอากาศที่พบบ่อย</h2>
          <div className="space-y-4">
            {Object.entries(stats.weatherCounts).map(([weather, count]: any) => {
              const percent = Math.round((count / stats.totalEntries) * 100);
              return (
                <div key={weather}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{weather}</span>
                    <span className="text-sm font-medium text-blue-600">{count} ครั้ง ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-300 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}