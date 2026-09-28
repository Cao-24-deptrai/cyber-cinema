"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Scan, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Ticket, 
  SwitchCamera, 
  Camera, 
  VideoOff, 
  Check, 
  RotateCcw
} from "lucide-react";
import toast from "react-hot-toast";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid" | "used">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Camera settings
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Khởi động Scanner với camera chỉ định
  const startScanner = useCallback(async (cameraConfig: string | MediaTrackConstraints) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsCameraLoading(true);
    setCameraError("");

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      const scanner = scannerRef.current;

      // Nếu camera đang chạy thì dừng trước khi đổi
      if (scanner.isScanning) {
        try {
          await scanner.stop();
        } catch (stopErr) {
          console.warn("Lỗi khi dừng scanner:", stopErr);
        }
      }

      const qrConfig = {
        fps: 12,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        cameraConfig,
        qrConfig,
        (decodedText) => {
          handleOnScanSuccess(decodedText);
        },
        () => {
          // Frame error callback - bỏ qua vì xảy ra liên tục khi chưa thấy QR
        }
      );

      setIsScanning(true);
      setIsCameraLoading(false);
    } catch (err: any) {
      console.error("Lỗi khi mở camera:", err);
      setIsScanning(false);
      setIsCameraLoading(false);
      setCameraError(err?.message || "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera trong trình duyệt.");
    } finally {
      isTransitioningRef.current = false;
    }
  }, []);

  // Xử lý khi quét trúng mã QR
  const handleOnScanSuccess = (decodedText: string) => {
    // Tạm dừng camera để hiển thị kết quả kiểm tra
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        scannerRef.current.pause(true);
      } catch (e) {
        console.warn("Pause error:", e);
      }
    }
    handleProcessTicket(decodedText);
  };

  // Quay camera mặt trước / mặt sau
  const handleSwitchFacingMode = async () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    setSelectedCameraId(""); // Xóa ID camera cố định để ưu tiên facingMode

    // Nếu đang có danh sách cameras, thử tìm camera tương ứng theo label
    let targetConfig: string | MediaTrackConstraints = { facingMode: nextMode };
    if (availableCameras.length > 1) {
      const match = availableCameras.find(c => {
        const label = c.label.toLowerCase();
        if (nextMode === "user") {
          return label.includes("front") || label.includes("user") || label.includes("selfie") || label.includes("trước");
        } else {
          return label.includes("back") || label.includes("rear") || label.includes("environment") || label.includes("sau");
        }
      });
      if (match) {
        setSelectedCameraId(match.id);
        targetConfig = match.id;
      }
    }

    toast.loading(`Đang chuyển sang Camera ${nextMode === "environment" ? "Mặt Sau" : "Mặt Trước"}...`, { duration: 1200 });
    await startScanner(targetConfig);
  };

  // Chọn camera cụ thể từ dropdown
  const handleSelectCamera = async (cameraId: string) => {
    setSelectedCameraId(cameraId);
    if (!cameraId) {
      await startScanner({ facingMode });
    } else {
      await startScanner(cameraId);
    }
  };

  // Khởi tạo ban đầu
  useEffect(() => {
    let isMounted = true;

    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (isMounted && devices && devices.length > 0) {
          setAvailableCameras(devices);
        }
      } catch (err) {
        console.log("Không lấy được danh sách camera:", err);
      }

      if (isMounted) {
        // Mặc định khởi động camera sau (environment)
        startScanner({ facingMode: "environment" });
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(console.error).then(() => {
            scannerRef.current?.clear();
          });
        } else {
          try {
            scannerRef.current.clear();
          } catch (e) {}
        }
      }
    };
  }, [startScanner]);

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

  // Quét tiếp / Quét vé mới (Resume lại camera)
  const handleResumeScan = () => {
    setScanResult(null);
    setTicketData(null);
    setStatus("idle");
    setErrorMessage("");

    if (scannerRef.current) {
      try {
        if (scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
          scannerRef.current.resume();
          return;
        }
      } catch (e) {
        console.warn("Resume failed, restarting scanner:", e);
      }
    }

    const config = selectedCameraId ? selectedCameraId : { facingMode };
    startScanner(config);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 border border-primary/40 rounded-xl box-glow">
            <Scan className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest text-glow mb-1">
              Soát vé tự động
            </h1>
            <p className="text-gray-400 text-sm">
              Đưa mã QR trên vé khách hàng vào khung quét để xác thực vé
            </p>
          </div>
        </div>

        {/* Nút Quay Camera Trước / Sau */}
        <button
          onClick={handleSwitchFacingMode}
          disabled={isCameraLoading}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/50 rounded-lg text-sm font-bold uppercase tracking-wider transition-all box-glow shadow-md cursor-pointer disabled:opacity-50"
          title="Quay đổi camera trước/sau"
        >
          <SwitchCamera className="w-5 h-5 shrink-0" />
          <span>
            {facingMode === "environment" ? "Quay Camera Trước" : "Quay Camera Sau"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột Camera (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-surface-border rounded-xl p-5 shadow-xl flex flex-col justify-between">
          {/* Controls Bar trên khung camera */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Camera: {facingMode === "environment" ? "Mặt Sau (Môi trường)" : "Mặt Trước (Selfie)"}
              </span>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
            </div>

            {/* Dropdown chọn Camera nếu có nhiều thiết bị */}
            {availableCameras.length > 1 && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCameraId}
                  onChange={(e) => handleSelectCamera(e.target.value)}
                  className="bg-background border border-surface-border text-white text-xs rounded-md px-2.5 py-1.5 focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="">
                    Tự động ({facingMode === "environment" ? "Mặt sau" : "Mặt trước"})
                  </option>
                  {availableCameras.map((cam, idx) => (
                    <option key={cam.id} value={cam.id}>
                      {cam.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Vùng Khung Video Quét QR */}
          <div className="relative aspect-square max-h-[420px] w-full bg-black rounded-lg overflow-hidden border-2 border-dashed border-primary/50 flex items-center justify-center">
            {/* Div gắn camera Html5Qrcode */}
            <div id="qr-reader" className="w-full h-full"></div>

            {/* Laser quét hiệu ứng chuyển động khi đang scan */}
            {isScanning && status === "idle" && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden flex flex-col justify-center items-center">
                <div className="w-[250px] h-[250px] relative border-2 border-primary/60 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  {/* Đường laser quét */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#ef4444] animate-laser" />
                  {/* 4 góc căn chỉnh */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                </div>
              </div>
            )}

            {/* Trạng thái Camera Loading */}
            {isCameraLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-primary z-20">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-semibold text-gray-300">Đang khởi động camera...</p>
              </div>
            )}

            {/* Trạng thái Lỗi Camera */}
            {cameraError && (
              <div className="absolute inset-0 bg-background/95 p-6 flex flex-col items-center justify-center text-center z-20">
                <VideoOff className="w-12 h-12 text-red-500 mb-3" />
                <h4 className="text-base font-bold text-white mb-2">Lỗi truy cập Camera</h4>
                <p className="text-xs text-gray-400 mb-4 max-w-xs">{cameraError}</p>
                <button
                  onClick={() => startScanner(selectedCameraId || { facingMode })}
                  className="px-4 py-2 bg-primary text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-primary-glow transition-all"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>

          {/* Thanh công cụ đáy camera */}
          <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span>Định dạng hỗ trợ:</span>
              <strong className="text-gray-200">QR Code CyberPlex</strong>
            </span>
            <button
              onClick={() => startScanner(selectedCameraId || { facingMode })}
              className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tải lại camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khởi động lại</span>
            </button>
          </div>
        </div>

        {/* Cột Kết quả Kiểm tra Vé (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-surface-border rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-surface-border pb-3 flex items-center justify-between">
              <span>Kết quả soát vé</span>
              {status !== "idle" && (
                <button
                  onClick={handleResumeScan}
                  className="text-xs font-bold text-primary hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Quét vé khác
                </button>
              )}
            </h2>

            {/* Trạng thái chờ */}
            {status === "idle" && (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-4">
                  <Scan className="w-10 h-10 opacity-40 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-gray-300 mb-1">Đang chờ quét vé</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Hướng camera vào mã QR vé xem phim của khách hàng để hệ thống tự động kiểm tra.
                </p>
              </div>
            )}

            {/* Đang truy xuất */}
            {status === "loading" && (
              <div className="py-16 flex flex-col items-center justify-center text-primary text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-white animate-pulse">Đang tra cứu dữ liệu vé...</p>
                <p className="text-xs text-gray-400 mt-1">Mã: {scanResult}</p>
              </div>
            )}

            {/* Vé Không Hợp Lệ */}
            {status === "invalid" && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-6 text-center">
                <XCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold uppercase text-red-500 mb-1">Vé Không Hợp Lệ</h3>
                <p className="text-sm text-gray-300 mb-4">{errorMessage || "Mã vé không tồn tại trên hệ thống!"}</p>
                <p className="text-xs text-gray-500 mb-6">Mã quét: <code className="text-red-400">{scanResult}</code></p>
                <button
                  onClick={handleResumeScan}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Tiếp tục quét vé khác
                </button>
              </div>
            )}

            {/* Vé Hợp Lệ hoặc Đã Sử Dụng */}
            {ticketData && (status === "valid" || status === "used") && (
              <div className="space-y-5">
                {/* Banner trạng thái */}
                {status === "valid" ? (
                  <div className="bg-green-500/15 border border-green-500/60 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-7 h-7 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-green-400 font-bold uppercase tracking-wider text-base">
                        Vé Hợp Lệ
                      </h3>
                      <p className="text-xs text-green-300/80">
                        Vé hợp lệ, đủ điều kiện check-in vào phòng chiếu.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-500/15 border border-orange-500/60 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-7 h-7 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-orange-400 font-bold uppercase tracking-wider text-base">
                        Vé Đã Sử Dụng
                      </h3>
                      <p className="text-xs text-orange-300/80">
                        Vé này đã được quét và xác nhận vào rạp trước đó.
                      </p>
                    </div>
                  </div>
                )}

                {/* Chi tiết vé */}
                <div className="bg-background/60 border border-surface-border rounded-xl p-4 space-y-3.5 text-sm">
                  <div className="flex items-start gap-3 pb-3 border-b border-surface-border">
                    <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Phim & Ghế</span>
                      <h4 className="text-white font-bold text-base text-glow uppercase leading-tight">
                        {ticketData.movieTitle}
                      </h4>
                      <p className="text-primary font-bold mt-1 text-sm">
                        Ghế ngồi: {Array.isArray(ticketData.seats) ? ticketData.seats.join(", ") : ticketData.seats}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-surface-border">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Ngày chiếu</span>
                        <p className="text-white font-medium">{ticketData.date || "Hôm nay"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Giờ chiếu</span>
                        <p className="text-white font-medium">{ticketData.time || "Đang cập nhật"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-3 border-b border-surface-border">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Rạp chiếu</span>
                      <p className="text-white font-medium">{ticketData.theaterName || "CyberPlex Cinema"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Khách hàng</span>
                      <p className="text-gray-300 text-xs font-mono truncate">{ticketData.userEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons ở chân kết quả */}
          {ticketData && (status === "valid" || status === "used") && (
            <div className="mt-6 pt-4 border-t border-surface-border space-y-3">
              {status === "valid" && (
                <button
                  onClick={handleCheckIn}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>Xác nhận cho vào rạp</span>
                </button>
              )}
              <button
                onClick={handleResumeScan}
                className="w-full py-3 bg-surface hover:bg-white/10 text-gray-300 hover:text-white border border-surface-border font-bold rounded-lg uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Quét vé tiếp theo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS for Scanner */}
      <style dangerouslySetInnerHTML={{__html: `
        #qr-reader {
          border: none !important;
          background: transparent !important;
        }
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 0.5rem;
        }
        #qr-reader img { display: none !important; }
        #qr-reader button { display: none !important; }
        #qr-reader a { display: none !important; }
        #qr-reader__scan_region {
          width: 100% !important;
          height: 100% !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #qr-shaded-region {
          border-color: rgba(239, 68, 68, 0.4) !important;
        }
        @keyframes laser-sweep {
          0% { top: 5%; opacity: 0.8; }
          50% { top: 95%; opacity: 1; }
          100% { top: 5%; opacity: 0.8; }
        }
        .animate-laser {
          position: absolute;
          animation: laser-sweep 2.4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
