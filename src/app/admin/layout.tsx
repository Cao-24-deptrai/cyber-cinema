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
  ShieldCheck, 
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Desktop sidebar collapse state
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

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
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-surface-border transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
            ${desktopSidebarOpen ? "md:w-64" : "md:w-20"}
          `}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border">
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 font-bold tracking-wider text-white uppercase overflow-hidden ${
                !desktopSidebarOpen ? "md:justify-center md:w-full" : ""
              }`}
            >
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              {(desktopSidebarOpen || mobileMenuOpen) && (
                <span className="text-lg">
                  CYBER<span className="text-primary text-glow">ADMIN</span>
                </span>
              )}
            </Link>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Đóng menu"
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
                  onClick={() => setMobileMenuOpen(false)}
                  title={item.name}
                  className={`flex items-center gap-3 px-3 py-3 rounded transition-all uppercase tracking-wider text-sm font-bold ${
                    !desktopSidebarOpen ? "md:justify-center" : ""
                  } ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/50 box-glow' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {(desktopSidebarOpen || mobileMenuOpen) && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom Sidebar Action Buttons */}
          <div className="p-3 border-t border-surface-border space-y-2">
            {/* Nút chuyển sang giao diện User */}
            <Link 
              href="/"
              title="Chuyển sang giao diện Người dùng (User)"
              className={`flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 transition-all rounded uppercase text-xs font-bold tracking-wider box-glow ${
                !desktopSidebarOpen ? "md:px-0" : "px-3"
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 shrink-0" />
              {(desktopSidebarOpen || mobileMenuOpen) && (
                <span className="truncate">Về Giao diện User</span>
              )}
            </Link>

            {/* Nút Đăng xuất */}
            <button 
              onClick={() => logout()}
              title="Đăng xuất tài khoản"
              className={`flex items-center justify-center gap-2 w-full py-2.5 bg-surface border border-surface-border text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all rounded uppercase text-xs font-bold tracking-wider cursor-pointer ${
                !desktopSidebarOpen ? "md:px-0" : "px-3"
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {(desktopSidebarOpen || mobileMenuOpen) && (
                <span className="truncate">Đăng xuất</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Admin Header Bar */}
          <header className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-3">
              {/* Nút Menu trên Mobile để mở Sidebar */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md border border-surface-border text-gray-300 hover:text-white hover:border-primary hover:bg-white/5 transition-all cursor-pointer box-glow flex items-center gap-2"
                aria-label="Mở menu bên trái"
                title="Mở menu bên trái"
              >
                <Menu className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Menu</span>
              </button>

              {/* Nút Menu Toggle trên Desktop để mở/thu gọn Sidebar */}
              <button 
                onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                className="hidden md:flex p-2 rounded-md border border-surface-border text-gray-300 hover:text-white hover:border-primary hover:bg-white/5 transition-all cursor-pointer box-glow items-center gap-1.5"
                aria-label="Thu gọn/Mở rộng Sidebar"
                title={desktopSidebarOpen ? "Thu gọn Sidebar" : "Mở rộng Sidebar"}
              >
                {desktopSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5 text-primary" />
                ) : (
                  <PanelLeft className="w-5 h-5 text-primary" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  {desktopSidebarOpen ? "Thu gọn" : "Mở Menu"}
                </span>
              </button>

              {/* Breadcrumb / Section Name */}
              <div className="hidden sm:flex items-center gap-2 text-sm ml-2">
                <span className="text-gray-500">CyberAdmin</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="font-bold text-white uppercase tracking-wider text-glow">{currentNav.name}</span>
              </div>
            </div>

            {/* Right Side: Nút chuyển qua lại giữa Admin và User & User info */}
            <div className="flex items-center gap-3">
              {/* NÚT CHUYỂN GIAO DIỆN ADMIN <-> USER */}
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/50 rounded-md text-xs font-bold uppercase tracking-wider transition-all box-glow shadow-sm"
                title="Chuyển sang giao diện Người dùng (User)"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Giao diện User</span>
              </Link>

              {/* User Email Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border bg-surface text-xs text-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-gray-400">{user?.email || "admin"}</span>
              </div>
            </div>
          </header>

          {/* Main Scrollable Content */}
          <main className="flex-1 overflow-y-auto relative z-10">
            {/* Background decorations for admin */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="p-4 sm:p-6 md:p-8 relative z-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
