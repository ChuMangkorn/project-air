import { useState } from "react";

export default function MyComponent() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("เซิร์ฟเวอร์ไม่ตอบสนอง");
      const result = await res.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      if (err.message.includes("Failed to fetch") || err.message.includes("Network")) {
        setError("ขาดการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบเน็ตของคุณ");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด");
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-2 mb-4">
          {error}
          <button onClick={fetchData} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
            ลองใหม่
          </button>
        </div>
      )}
      <button onClick={fetchData} className="px-3 py-1 bg-green-500 text-white rounded">
        โหลดข้อมูล
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
