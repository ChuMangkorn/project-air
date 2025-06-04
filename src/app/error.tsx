'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // ส่ง log ไป monitoring service ได้ที่นี่
    console.error(error);
  }, [error]);

  return (
    <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 my-6">
      <h2>เกิดข้อผิดพลาดบางอย่างในระบบ</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
      >
        ลองใหม่
      </button>
    </div>
  );
}
