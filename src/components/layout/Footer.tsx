"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Ẩn Footer khi đang ở trang Admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-surface-border bg-surface mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
            <span className="text-lg font-bold tracking-wider text-white">
              CYBER<span className="text-primary">PLEX</span>
            </span>
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="/support" className="hover:text-white transition-colors">Hỗ trợ</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CYBERPLEX CINEMAS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
