"use client";

import Link from "next/link";
import { Film, User, Search, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
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
        <div className="flex items-center gap-4">
          <Link href="/movies" className="text-gray-400 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-white border border-surface-border px-3 py-1.5 rounded-full hover:border-primary transition-colors"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-surface-border rounded-md shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-surface-border mb-2">
                    <p className="text-xs text-gray-400">Đang đăng nhập dưới tên</p>
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    Hồ sơ cá nhân
                  </Link>
                  <Link href="/profile/tickets" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    Vé của tôi
                  </Link>
                  <button 
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-2 border-t border-surface-border pt-2"
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

          <button className="md:hidden text-gray-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
