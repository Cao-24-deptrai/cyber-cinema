"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Ticket, DollarSign, Film, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch movies
        const moviesSnap = await getDocs(collection(db, "movies"));
        const moviesCount = moviesSnap.size;

        // Fetch bookings
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        let tickets = 0;
        let revenue = 0;
        const bookingsList: any[] = [];
        
        bookingsSnap.forEach(doc => {
          const data = doc.data();
          tickets += data.seats?.length || 0;
          revenue += data.totalAmount || 0;
          bookingsList.push({ id: doc.id, ...data });
        });

        // Sắp xếp booking mới nhất (sắp xếp tay bằng JS)
        bookingsList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setStats({
          totalMovies: moviesCount,
          totalTickets: tickets,
          totalRevenue: revenue
        });
        
        setRecentBookings(bookingsList.slice(0, 5)); // Lấy 5 đơn mới nhất
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-primary font-mono animate-pulse uppercase">Đang đồng bộ dữ liệu hệ thống...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white uppercase tracking-widest text-glow mb-8 flex items-center gap-3">
        <Activity className="w-8 h-8 text-primary" />
        Hệ thống Giám sát trung tâm
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface border border-surface-border p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-bl-full group-hover:bg-primary/20 transition-colors" />
          <DollarSign className="w-8 h-8 text-primary mb-4" />
          <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Tổng Doanh Thu</p>
          <h2 className="text-3xl font-bold text-white text-glow">{stats.totalRevenue.toLocaleString('vi-VN')} đ</h2>
        </div>
        
        <div className="bg-surface border border-surface-border p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-bl-full group-hover:bg-green-500/20 transition-colors" />
          <Ticket className="w-8 h-8 text-green-500 mb-4" />
          <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Vé Đã Bán</p>
          <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{stats.totalTickets}</h2>
        </div>

        <div className="bg-surface border border-surface-border p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-bl-full group-hover:bg-blue-500/20 transition-colors" />
          <Film className="w-8 h-8 text-blue-500 mb-4" />
          <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Phim Đang Chiếu</p>
          <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{stats.totalMovies}</h2>
        </div>
      </div>

      {/* Giao dịch gần đây */}
      <div className="bg-surface border border-surface-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 border-l-4 border-primary pl-3">Giao dịch gần đây</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-gray-500 text-xs uppercase tracking-widest">
                <th className="pb-3 font-bold">Mã HĐ</th>
                <th className="pb-3 font-bold">Tài khoản</th>
                <th className="pb-3 font-bold">Phim</th>
                <th className="pb-3 font-bold">Ghế</th>
                <th className="pb-3 font-bold text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Chưa có dữ liệu giao dịch</td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-surface-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono text-xs text-gray-400">{booking.id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-4 text-sm text-gray-300">{booking.userEmail}</td>
                    <td className="py-4 text-sm text-white font-medium">{booking.movieTitle}</td>
                    <td className="py-4 text-sm text-primary font-bold">{booking.seats?.join(", ")}</td>
                    <td className="py-4 text-sm text-white font-bold text-right">{booking.totalAmount?.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
