"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, CalendarDays, Ticket, LogOut, ScanLine } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý Phim", href: "/admin/movies", icon: Film },
    { name: "Lịch chiếu", href: "/admin/showtimes", icon: CalendarDays },
    { name: "Soát vé (QR)", href: "/admin/scanner", icon: ScanLine },
  ];

  return (
    <AdminGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-surface-border flex flex-col relative z-20">
          <div className="h-16 flex items-center justify-center border-b border-surface-border">
            <Link href="/" className="text-xl font-bold tracking-wider text-white uppercase">
              CYBER<span className="text-primary text-glow">ADMIN</span>
            </Link>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all uppercase tracking-wider text-sm font-bold ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/50 box-glow' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-surface-border">
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-surface border border-surface-border text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded uppercase text-sm font-bold tracking-widest">
              <LogOut className="w-4 h-4" />
              Thoát Admin
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          {/* Background decorations for admin */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="p-8 relative z-20">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
