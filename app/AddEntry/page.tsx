'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEntry() {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('😊');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ดึงพิกัดจากเครื่องผู้ใช้ เพื่อความแม่นยำในการเช็กสภาพอากาศ
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, mood, lat: latitude, lon: longitude }),
        });

        if (res.ok) {
          router.push('/');
          router.refresh();
        } else {
          const data = await res.json();
          setError(data.error);
          setLoading(false);
        }
      },
      async (err) => {
        // ถ้าผู้ใช้ไม่อนุญาตให้เข้าถึงตำแหน่ง ให้ส่งแบบไม่มีพิกัด (ระบบหลังบ้านจะดึงตามชื่อเมืองเริ่มต้นแทน)
        const res = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, mood }),
        });

        if (res.ok) {
          router.push('/');
          router.refresh();
        } else {
          const data = await res.json();
          setError(data.error);
          setLoading(false);
        }
      }
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-amber-200">
      <h2 className="text-2xl font-bold mb-4 text-[#333]">📝 บันทึกอารมณ์วันนี้</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* เลือก Emoji */}
        <div>
          <label className="block font-bold mb-2">วันนี้รู้สึกอย่างไร?</label>
          <div className="flex gap-4 text-3xl justify-center">
            {['😊', '😭', '😡', '😴', '🥰'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`p-2 rounded-full transition-all ${mood === emoji ? 'bg-amber-200 scale-110' : 'hover:bg-gray-100'}`}
                onClick={() => setMood(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* พิมพ์ข้อความ (ปรับเป็น Textarea เพื่อให้พิมพ์ได้จุใจขึ้น) */}
        <div>
          <label className="block font-bold mb-2">เล่าให้ฟังหน่อย</label>
          <textarea
            className="w-full border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-amber-400 min-h-[100px]"
            placeholder="วันนี้เจอเรื่องอะไรมาบ้าง..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={300}
          />
          <p className="text-xs text-gray-400 mt-1 flex justify-end">{message.length}/300 ตัวอักษร</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white font-bold p-3 rounded-lg transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#997A2E] hover:bg-[#7a6124]'}`}
        >
          {loading ? 'กำลังบันทึกข้อมูลและสภาพอากาศ...' : 'บันทึกไดอารี่'}
        </button>
      </form>
    </div>
  );
}