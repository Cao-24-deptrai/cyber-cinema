"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Đặt email admin làm mật định hoặc lấy từ biến môi trường
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cyberplex.com";
      
      if (!user) {
        router.push("/auth/login");
      } else if (user.email !== adminEmail) {
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-primary font-mono animate-pulse uppercase tracking-widest">Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Nếu không phải admin
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cyberplex.com";
  if (user?.email !== adminEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-red-500/50 p-8 rounded-lg max-w-md w-full text-center box-glow relative overflow-hidden">
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider text-glow">Truy cập bị từ chối</h2>
          <p className="text-gray-400 mb-8">Khu vực này được bảo mật. Chỉ tài khoản Quản trị viên mạng ({adminEmail}) mới được cấp phép.</p>
          
          <Link href="/" className="inline-block w-full py-3 bg-surface border border-surface-border text-white font-bold rounded hover:bg-white/5 transition-colors uppercase tracking-widest box-glow text-sm">
            Quay về trạm gốc (Trang chủ)
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
