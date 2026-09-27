"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Film, 
  CalendarDays, 
  ScanLine, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeftRight, 
  ChevronRight,
  ChevronDown
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // State quản lý đóng/mở Sidebar menu
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý Phim", href: "/admin/movies", icon: Film },
    { name: "Lịch chiếu", href: "/admin/showtimes", icon: CalendarDays },
    { name: "Soát vé (QR)", href: "/admin/scanner", icon: ScanLine },
  ];

  const currentNav = navItems.find(item => item.href === pathname) || { name: "Quản trị hệ thống" };

  return (
    <AdminGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Mobile Backdrop khi mở Sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Menu bên trái */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-surface-border transition-all duration-300 ease-in-out
            ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden border-r-0"}
          `}
        >
          {/* Sidebar Top: Nút đóng sidebar */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border">
            <span className="text-sm font-bold tracking-wider text-gray-300 uppercase">
              Bảng Quản Trị
            </span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Đóng sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded transition-all uppercase tracking-wider text-sm font-bold ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/50 box-glow' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Đáy Sidebar: Chỉ có nút Đăng xuất */}
          <div className="p-3 border-t border-surface-border">
            <button 
              onClick={() => logout()}
              title="Đăng xuất tài khoản"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface border border-surface-border text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all rounded uppercase text-xs font-bold tracking-wider cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Khu vực nội dung chính */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Thanh Header Admin */}
          <header className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-3">
              {/* NÚT MENU MỞ / ĐÓNG SIDEBAR BÊN TRÁI */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg border border-surface-border text-gray-200 hover:text-white hover:border-primary hover:bg-white/5 transition-all cursor-pointer box-glow flex items-center gap-2"
                aria-label="Mở menu bên trái"
                title={sidebarOpen ? "Đóng menu sidebar" : "Mở menu sidebar"}
              >
                <Menu className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Menu</span>
              </button>

              {/* Breadcrumb tiêu đề trang */}
              <div className="hidden sm:flex items-center gap-2 text-sm ml-2">
                <span className="text-gray-500">Quản trị</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="font-bold text-white uppercase tracking-wider text-glow">{currentNav.name}</span>
              </div>
            </div>

            {/* Bên phải: Duy nhất 1 nút đổi giao diện nằm cạnh nút tài khoản */}
            <div className="flex items-center gap-3">
              {/* DUY NHẤT 1 NÚT ĐỔI GIAO DIỆN ADMIN <-> USER NẰM KẾ NÚT TÀI KHOẢN */}
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/50 rounded-md text-xs font-bold uppercase tracking-wider transition-all box-glow shadow-sm"
                title="Chuyển sang giao diện Người dùng (User)"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Giao diện User</span>
              </Link>

              {/* Nút tài khoản (Avatar + Dropdown) */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-white border border-surface-border px-3 py-1.5 rounded-full hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center font-bold text-xs uppercase text-white">
                    {user?.email?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.email?.split('@')[0] || "admin"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-surface-border rounded-md shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-surface-border mb-2">
                      <p className="text-xs text-gray-400">Tài khoản Quản trị</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto relative z-10">
            <div className="p-4 sm:p-6 md:p-8 relative z-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
