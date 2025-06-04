import React from "react";

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 my-6">
          เกิดข้อผิดพลาด กรุณารีเฟรชหน้าหรือแจ้งผู้ดูแลระบบ
        </div>
      );
    }
    return this.props.children;
  }
}
