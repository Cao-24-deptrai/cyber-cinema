"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Monitor } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
const SEATS_PER_ROW = 12;

const SEAT_PRICES = {
  standard: 80000,
  vip: 120000,
  couple: 200000,
};

export default function SeatSelectionPage({ params }: { params: Promise<{ showtimeId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const showtimeId = resolvedParams.showtimeId;

  const [movie, setMovie] = useState<any>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lắng nghe thay đổi real-time của lịch chiếu này (để lấy danh sách ghế đã đặt)
    const showtimeRef = doc(db, "showtimes", showtimeId);
    
    const unsubscribe = onSnapshot(showtimeRef, async (docSnap) => {
      if (docSnap.exists()) {
        const stData = docSnap.data();
        setShowtime({ id: docSnap.id, ...stData });
        setBookedSeats(stData.bookedSeats || []);
        
        // Loại bỏ những ghế đang chọn nếu nó vừa bị người khác đặt mất
        setSelectedSeats(prev => prev.filter(seat => !(stData.bookedSeats || []).includes(seat)));

        // Fetch movie info only once
        if (!movie) {
          const mDoc = await getDoc(doc(db, "movies", stData.movieId));
          if (mDoc.exists()) {
            setMovie({ id: mDoc.id, ...mDoc.data() });
          }
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [showtimeId, movie]);

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatType = (row: string) => {
    if (row === "K") return "couple";
    if (["E", "F", "G"].includes(row)) return "vip";
    return "standard";
  };

  const getSeatPrice = (seatId: string) => {
    const row = seatId.charAt(0);
    return SEAT_PRICES[getSeatType(row) as keyof typeof SEAT_PRICES];
  };

  if (loading || !movie || !showtime) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary animate-pulse font-mono">Đang tải dữ liệu phòng chiếu...</div>;
  }

  const totalPrice = selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    const seatsQuery = selectedSeats.join(',');
    router.push(`/checkout?showtime=${showtimeId}&seats=${seatsQuery}&total=${totalPrice}`);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-surface border-b border-surface-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white uppercase text-glow">{movie.title}</h1>
              <p className="text-sm text-gray-400">{showtime.theaterName} • {showtime.format} • {showtime.time}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 overflow-x-auto">
        <div className="min-w-[800px] max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-3/4 mb-16 relative">
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent box-glow w-full opacity-80" />
            <div className="h-10 bg-gradient-to-b from-primary/20 to-transparent w-full opacity-50 blur-md absolute top-0" />
            <div className="text-center text-primary uppercase tracking-widest text-xs font-bold mt-4 flex items-center justify-center gap-2">
              <Monitor className="w-4 h-4" /> Màn hình
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mb-12">
            {ROWS.map((row) => (
              <div key={row} className="flex items-center justify-center gap-2 md:gap-4">
                <div className="w-6 text-center font-bold text-gray-500">{row}</div>
                <div className="flex gap-2 md:gap-3">
                  {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                    const seatNumber = i + 1;
                    const seatId = `${row}${seatNumber}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const seatType = getSeatType(row);
                    const isAisle = seatNumber === 6;

                    let baseStyle = "w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border-2 transition-all duration-300 flex items-center justify-center text-xs font-medium cursor-pointer";
                    
                    if (seatType === "couple") {
                        if (seatNumber % 2 === 0) return null;
                        baseStyle = "w-[72px] md:w-[92px] h-8 md:h-10 rounded-t-lg rounded-b-sm border-2 transition-all duration-300 flex items-center justify-center text-xs font-medium cursor-pointer";
                    }

                    if (isBooked) {
                      baseStyle += " bg-surface-border border-surface-border text-gray-600 cursor-not-allowed opacity-50";
                    } else if (isSelected) {
                      baseStyle += " bg-primary border-primary text-white box-glow scale-110";
                    } else {
                      if (seatType === "vip") {
                        baseStyle += " border-primary/50 text-primary hover:bg-primary/20 hover:scale-105";
                      } else if (seatType === "couple") {
                        baseStyle += " border-pink-500/50 text-pink-500 hover:bg-pink-500/20 hover:scale-105";
                      } else {
                        baseStyle += " border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white hover:scale-105";
                      }
                    }

                    return (
                      <div key={seatId} className="flex gap-2 md:gap-3">
                        <button disabled={isBooked} onClick={() => toggleSeat(seatId)} className={baseStyle} title={`${seatId} - ${getSeatPrice(seatId).toLocaleString('vi-VN')}đ`}>
                          {isSelected ? seatId : ""}
                        </button>
                        {isAisle && <div className="w-4 md:w-8" />}
                      </div>
                    );
                  })}
                </div>
                <div className="w-6 text-center font-bold text-gray-500">{row}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-gray-600 rounded-t" /> Ghế thường</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-primary/50 rounded-t" /> Ghế VIP</div>
            <div className="flex items-center gap-2"><div className="w-10 h-6 border-2 border-pink-500/50 rounded-t" /> Ghế Đôi (Couple)</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-primary border-2 border-primary rounded-t box-glow" /> Đang chọn</div>
            <div className="flex items-center gap-2"><div className="w-6 h-6 bg-surface-border border-2 border-surface-border rounded-t opacity-50" /> Đã đặt</div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-surface-border p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-8">
            <div>
              <p className="text-gray-400 text-sm">Ghế đã chọn:</p>
              <p className="text-lg font-bold text-white">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tổng tiền:</p>
              <p className="text-xl font-bold text-primary text-glow">{totalPrice.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={selectedSeats.length === 0} className={`w-full md:w-auto px-12 py-3 font-bold rounded-sm uppercase tracking-wider transition-all ${selectedSeats.length > 0 ? 'bg-primary text-white hover:bg-primary-glow box-glow cursor-pointer' : 'bg-surface-border text-gray-500 cursor-not-allowed'}`}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
