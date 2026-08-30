"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scan, CheckCircle2, XCircle, AlertCircle, RefreshCw, Calendar, Clock, MapPin, User, Ticket } from "lucide-react";
import toast from "react-hot-toast";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid" | "used">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Chỉ khởi tạo scanner ở client side
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      // Ngăn quét liên tục cùng 1 mã
      if (decodedText !== scanResult) {
        scanner.pause(true); // Tạm dừng quét để xử lý
        handleProcessTicket(decodedText);
      }
    };

    scanner.render(onScanSuccess, (err) => {
      // Ignore scan errors as they happen constantly when no QR is in view
    });

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanResult]);

  const handleProcessTicket = async (ticketId: string) => {
    setScanResult(ticketId);
    setStatus("loading");
    setTicketData(null);
    setErrorMessage("");

    try {
      const ticketRef = doc(db, "bookings", ticketId);
      const ticketSnap = await getDoc(ticketRef);

      if (!ticketSnap.exists()) {
        setStatus("invalid");
        setErrorMessage("Mã vé không tồn tại trong hệ thống!");
        return;
      }

      const data = ticketSnap.data();
      setTicketData({ id: ticketSnap.id, ...data });

      if (data.status === "checked-in") {
        setStatus("used");
      } else {
        setStatus("valid");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra vé:", error);
      setStatus("invalid");
      setErrorMessage("Có lỗi hệ thống, vui lòng thử lại.");
    }
  };

  const handleCheckIn = async () => {
    if (!ticketData || status !== "valid") return;
    setStatus("loading");
    const loadingToast = toast.loading("Đang xử lý check-in...");

    try {
      const ticketRef = doc(db, "bookings", ticketData.id);
      await updateDoc(ticketRef, {
        status: "checked-in"
      });
      setStatus("used");
      setTicketData({ ...ticketData, status: "checked-in" });
      toast.success("Check-in thành công!");
    } catch (error) {
      console.error("Lỗi Check-in:", error);
      toast.error("Không thể check-in lúc này.");
      setStatus("valid");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setTicketData(null);
    setStatus("idle");
    setErrorMessage("");
    // Html5QrcodeScanner tự động resume khi component re-render nếu chưa clear
    // Thực tế cách tốt nhất là reload trang cho đơn giản với thiết bị di động
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Scan className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest text-glow mb-1">Soát vé tự động</h1>
          <p className="text-gray-400">Đưa mã QR trên vé của khách hàng vào camera để kiểm tra</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột Camera */}
        <div className="bg-surface border border-surface-border rounded-lg p-4 overflow-hidden">
          <div className="relative">
            {/* The ID must match the one in Html5QrcodeScanner */}
            <div id="qr-reader" className="w-full bg-black rounded-lg overflow-hidden border-2 border-dashed border-primary/50"></div>
            
            {/* Styles for html5-qrcode UI to match our theme */}
            <style dangerouslySetInnerHTML={{__html: `
              #qr-reader { border: none !important; }
              #qr-reader img { display: none !important; }
              #qr-reader button {
                background: #ef4444; color: white; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; text-transform: uppercase; margin-top: 10px;
              }
              #qr-reader a { color: #ef4444; }
              #qr-reader__scan_region { min-height: 300px; display: flex; align-items: center; justify-content: center; }
            `}} />
          </div>
          
          <div className="mt-4 text-center">
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 justify-center w-full">
              <RefreshCw className="w-4 h-4" /> Khởi động lại Máy quét
            </button>
          </div>
        </div>

        {/* Cột Kết quả */}
        <div className="bg-surface border border-surface-border rounded-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white uppercase mb-6 border-b border-surface-border pb-4">Kết quả quét</h2>

          {status === "idle" && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Scan className="w-16 h-16 mb-4 opacity-50" />
              <p>Đang chờ tín hiệu mã QR...</p>
            </div>
          )}

          {status === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center text-primary">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="animate-pulse">Đang truy xuất dữ liệu từ trung tâm...</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500 bg-red-500/10 rounded-lg p-6 border border-red-500/30">
              <XCircle className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold uppercase mb-2">Vé Không Hợp Lệ</h3>
              <p className="text-center">{errorMessage || "Mã vé không tồn tại hoặc có lỗi xảy ra."}</p>
            </div>
          )}

          {ticketData && (status === "valid" || status === "used") && (
            <div className="flex-1 flex flex-col">
              {/* Alert Box */}
              {status === "valid" ? (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <h3 className="text-green-500 font-bold uppercase tracking-wider">Vé Hợp Lệ</h3>
                    <p className="text-sm text-green-500/80">Khách hàng có thể vào rạp.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
                  <div>
                    <h3 className="text-orange-500 font-bold uppercase tracking-wider">Vé Đã Sử Dụng</h3>
                    <p className="text-sm text-orange-500/80">Vé này đã được quét để vào rạp trước đó.</p>
                  </div>
                </div>
              )}

              {/* Thông tin vé */}
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex gap-3 items-center">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Tài khoản</p>
                    <p className="text-white font-medium">{ticketData.userEmail}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phim & Ghế</p>
                    <p className="text-white font-bold text-lg text-glow uppercase">{ticketData.movieTitle}</p>
                    <p className="text-primary font-bold">Ghế: {ticketData.seats?.join(", ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-3 items-center">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Ngày chiếu</p>
                      <p className="text-white">{ticketData.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Giờ chiếu</p>
                      <p className="text-white">{ticketData.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Cụm rạp</p>
                    <p className="text-white">{ticketData.theaterName}</p>
                  </div>
                </div>
              </div>

              {/* Nút Check-in */}
              {status === "valid" && (
                <button 
                  onClick={handleCheckIn}
                  className="w-full py-4 bg-primary text-white font-bold rounded uppercase tracking-widest hover:bg-primary-glow transition-all box-glow text-lg"
                >
                  Xác nhận vào rạp
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
