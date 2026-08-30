"use client";

import { useState, Suspense, useEffect } from "react";
import { ArrowLeft, CreditCard, Wallet, QrCode, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const showtimeId = searchParams.get("showtime");
  const seats = searchParams.get("seats")?.split(",") || [];
  const totalParam = searchParams.get("total") || "0";
  const baseTotal = parseInt(totalParam, 10);

  const [movie, setMovie] = useState<any>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addCombo, setAddCombo] = useState(false);
  const [bookingId, setBookingId] = useState("");
  
  const comboPrice = 85000;
  const finalTotal = baseTotal + (addCombo ? comboPrice : 0);

  useEffect(() => {
    async function fetchData() {
      if (!showtimeId) return;
      const stDoc = await getDoc(doc(db, "showtimes", showtimeId));
      if (stDoc.exists()) {
        const stData = stDoc.data();
        setShowtime({ id: stDoc.id, ...stData });
        
        const mDoc = await getDoc(doc(db, "movies", stData.movieId));
        if (mDoc.exists()) {
          setMovie({ id: mDoc.id, ...mDoc.data() });
        }
      }
    }
    fetchData();
  }, [showtimeId]);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán.");
      router.push("/auth/login");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Đang xử lý thanh toán...");
    
    try {
      if (showtimeId && seats.length > 0) {
        // 1. Cập nhật trạng thái ghế trong showtime
        const showtimeRef = doc(db, "showtimes", showtimeId);
        await updateDoc(showtimeRef, {
          bookedSeats: arrayUnion(...seats)
        });

        // 2. Tạo đơn hàng (Booking) lưu vào Firestore
        const newBooking = {
          userId: user.uid,
          userEmail: user.email,
          showtimeId: showtimeId,
          movieTitle: movie.title,
          theaterName: showtime.theaterName,
          time: showtime.time,
          date: showtime.date,
          seats: seats,
          totalAmount: finalTotal,
          hasCombo: addCombo,
          createdAt: serverTimestamp(),
          status: "success"
        };
        
        const docRef = await addDoc(collection(db, "bookings"), newBooking);
        setBookingId(docRef.id);
      }
      
      // Giả lập delay hiển thị UI
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        toast.dismiss(loadingToast);
        toast.success("Thanh toán thành công!");
      }, 1500);

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.dismiss(loadingToast);
      toast.error("Có lỗi xảy ra khi thanh toán!");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-primary/50 p-8 rounded-lg max-w-md w-full text-center box-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#e50914]" />
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6 text-glow" />
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">Thành công</h2>
          <p className="text-gray-400 mb-8">Vé điện tử đã được gửi vào email của bạn.</p>
          
          <div className="bg-background border border-surface-border p-4 rounded text-left mb-8">
            <p className="text-xs text-gray-500 uppercase mb-1">Mã đặt vé</p>
            <p className="text-xl font-mono text-white tracking-widest">{bookingId ? bookingId.substring(0, 8).toUpperCase() : "ĐANG TẠO..."}</p>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => router.push('/profile/tickets')} className="flex-1 py-3 bg-surface border border-surface-border text-white font-bold rounded hover:bg-white/5 transition-colors uppercase tracking-widest text-sm">
              Xem vé
            </button>
            <button onClick={() => router.push('/')} className="flex-1 py-3 bg-primary text-white font-bold rounded hover:bg-primary-glow transition-colors uppercase tracking-widest box-glow text-sm">
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie || !showtime) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary animate-pulse font-mono">Đang tải thông tin đơn hàng...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface border-b border-surface-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Thanh toán</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface border border-surface-border rounded-md p-6">
              <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">Dịch vụ cộng thêm</h2>
              <div className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-colors ${addCombo ? 'border-primary bg-primary/5 text-white' : 'border-surface-border text-gray-400'}`} onClick={() => setAddCombo(!addCombo)}>
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border ${addCombo ? 'bg-primary border-primary text-white' : 'border-gray-500'}`}>
                    {addCombo && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`font-bold ${addCombo ? 'text-white' : 'text-gray-300'}`}>Combo Cyber</p>
                    <p className="text-sm mt-1">1 Bắp lớn + 2 Nước ngọt</p>
                  </div>
                </div>
                <p className="font-bold">{comboPrice.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>

            <div className="bg-surface border border-surface-border rounded-md p-6">
              <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {/* Options */}
                {['credit', 'wallet', 'qr'].map((method) => (
                  <label key={method} className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-all ${paymentMethod === method ? 'border-primary box-glow bg-primary/5' : 'border-surface-border hover:border-gray-500'}`}>
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-primary' : 'border-gray-500'}`}>
                      {paymentMethod === method && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    {method === 'credit' ? <CreditCard className={`w-6 h-6 ${paymentMethod === method ? 'text-primary' : 'text-gray-400'}`} /> : 
                     method === 'wallet' ? <Wallet className={`w-6 h-6 ${paymentMethod === method ? 'text-primary' : 'text-gray-400'}`} /> :
                     <QrCode className={`w-6 h-6 ${paymentMethod === method ? 'text-primary' : 'text-gray-400'}`} />}
                    <span className="font-medium text-white">{method === 'credit' ? 'Thẻ Tín dụng / Ghi nợ' : method === 'wallet' ? 'Ví điện tử (Momo, ZaloPay)' : 'Quét mã QR'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface border border-surface-border rounded-md overflow-hidden sticky top-36">
              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${movie.bannerUrl})` }}>
                <div className="w-full h-full bg-black/60 flex items-center px-6">
                  <h3 className="text-xl font-bold text-white text-glow truncate">{movie.title}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rạp:</span>
                  <span className="text-white font-medium text-right">{showtime.theaterName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Suất chiếu:</span>
                  <span className="text-white font-medium">{showtime.time} | {showtime.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ghế:</span>
                  <span className="text-primary font-bold">{seats.join(", ")}</span>
                </div>
                <hr className="border-surface-border my-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiền vé:</span>
                  <span className="text-white">{baseTotal.toLocaleString('vi-VN')} đ</span>
                </div>
                {addCombo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Combo:</span>
                    <span className="text-white">{comboPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <hr className="border-surface-border my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 uppercase text-sm tracking-wider">Tổng cộng</span>
                  <span className="text-3xl font-bold text-primary text-glow">{finalTotal.toLocaleString('vi-VN')} đ</span>
                </div>

                <button onClick={handlePayment} disabled={isProcessing} className="w-full mt-6 py-4 bg-primary text-white font-bold rounded uppercase tracking-widest hover:bg-primary-glow transition-all box-glow flex items-center justify-center">
                  {isProcessing ? <span className="animate-pulse">Đang xử lý...</span> : "Xác nhận thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono text-xl animate-pulse">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
