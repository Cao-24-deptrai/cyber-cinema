"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Search, Menu, X, LogOut, ChevronDown, ArrowLeftRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Ẩn hoàn toàn Navbar của người dùng khi đang ở trang Admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cyberplex.com";
  const isAdmin = Boolean(user && (user.email === adminEmail || user.email?.includes("admin")));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Film className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
          <span className="text-xl font-bold tracking-wider text-white">
            CYBER<span className="text-primary text-glow">PLEX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all">PHIM</Link>
          <Link href="/showtimes" className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all">LỊCH CHIẾU</Link>
          <Link href="/theaters" className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all">RẠP</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/movies" className="text-gray-400 hover:text-primary transition-colors p-1" title="Tìm kiếm">
            <Search className="w-5 h-5" />
          </Link>
          
          {/* NÚT DUY NHẤT ĐỔI GIAO DIỆN ADMIN NẰM KẾ NÚT TÀI KHOẢN */}
          {isAdmin && (
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/50 rounded-md text-xs font-bold uppercase tracking-wider transition-all box-glow"
              title="Chuyển sang giao diện Quản trị viên (Admin)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Giao diện Admin</span>
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-white border border-surface-border px-3 py-1.5 rounded-full hover:border-primary transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center font-bold text-xs uppercase text-white">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-surface-border rounded-md shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-surface-border mb-2">
                    <p className="text-xs text-gray-400">Đang đăng nhập dưới tên</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-bold hover:bg-primary/10 transition-colors border-b border-surface-border mb-1"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Trang Quản trị (Admin)</span>
                    </Link>
                  )}

                  <Link 
                    href="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link 
                    href="/profile/tickets" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Vé của tôi
                  </Link>
                  <button 
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-2 border-t border-surface-border pt-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="text-sm font-bold text-white border border-primary px-4 py-1.5 rounded hover:bg-primary/20 transition-all box-glow uppercase"
            >
              Đăng nhập
            </Link>
          )}

          {/* Nút Mobile Menu */}
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface/95 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {isAdmin && (
            <Link 
              href="/admin" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/20 text-primary border border-primary/50 rounded text-xs font-bold uppercase tracking-wider box-glow"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Chuyển sang Giao diện Admin</span>
            </Link>
          )}
          <Link 
            href="/movies" 
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-300 hover:text-primary transition-colors border-b border-surface-border/50"
          >
            PHIM
          </Link>
          <Link 
            href="/showtimes" 
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-300 hover:text-primary transition-colors border-b border-surface-border/50"
          >
            LỊCH CHIẾU
          </Link>
          <Link 
            href="/theaters" 
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-300 hover:text-primary transition-colors"
          >
            RẠP
          </Link>
        </div>
      )}
    </nav>
  );
}
