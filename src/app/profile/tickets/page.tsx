"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, Calendar, Clock, MapPin } from "lucide-react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyTicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchTickets() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedTickets: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedTickets.push({ id: doc.id, ...doc.data() });
        });
        
        // Sắp xếp vé mới nhất lên đầu bằng Javascript để tránh lỗi thiếu Composite Index của Firebase
        fetchedTickets.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Lỗi lấy vé:", error);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      fetchTickets();
    }
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-surface-border rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-surface-border rounded animate-pulse" />
            <div className="h-4 w-64 bg-surface-border rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2].map(n => (
            <div key={n} className="bg-surface border border-surface-border rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-surface border border-surface-border rounded-full flex items-center justify-center">
          <Ticket className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider text-glow">Vé của tôi</h1>
          <p className="text-gray-400">Danh sách các vé bạn đã đặt trên hệ thống Cyberplex</p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-surface border border-surface-border p-12 rounded-lg text-center">
          <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Chưa có dữ liệu vé</h3>
          <p className="text-gray-400 mb-6">Bạn chưa đặt vé nào. Hãy chọn một bộ phim yêu thích và đặt ngay nhé!</p>
          <Link href="/movies" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded box-glow uppercase tracking-widest hover:bg-primary-glow transition-all">
            Xem phim đang chiếu
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-surface border border-surface-border rounded-lg overflow-hidden flex flex-col md:flex-row group hover:border-primary/50 transition-colors">
              {/* Cột thông tin */}
              <div className="flex-1 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white text-glow uppercase">{ticket.movieTitle}</h2>
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/50 rounded text-xs font-bold uppercase tracking-wider">
                      Thành công
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{ticket.theaterName}</span>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{ticket.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{ticket.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-end gap-6 pt-6 border-t border-surface-border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ghế</p>
                    <p className="text-lg font-bold text-primary">{ticket.seats.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mã tham chiếu</p>
                    <p className="text-lg font-mono text-white">{ticket.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  {ticket.hasCombo && (
                    <div className="ml-auto px-3 py-1 border border-primary/50 text-primary rounded-sm text-xs font-bold bg-primary/5">
                      + COMBO
                    </div>
                  )}
                </div>
              </div>

              {/* Phần QR / Mã vạch bên phải */}
              <div className="w-full md:w-64 bg-background border-l-2 border-dashed border-surface-border relative p-6 flex flex-col items-center justify-center">
                <div className="absolute -left-3 top-[-1px] w-6 h-6 rounded-full bg-background border-b-2 border-r-2 border-surface-border transform -translate-y-1/2 rotate-45 hidden md:block" />
                <div className="absolute -left-3 bottom-[-1px] w-6 h-6 rounded-full bg-background border-t-2 border-r-2 border-surface-border transform translate-y-1/2 -rotate-45 hidden md:block" />
                
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Vé Điện Tử</p>
                <div className="bg-white p-3 rounded-md box-glow mb-4">
                  <QRCode value={ticket.id} size={112} level="H" />
                </div>
                <p className="text-xs text-gray-400 font-mono tracking-[0.2em]">{ticket.id.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
