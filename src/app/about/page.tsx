"use client";

import Link from "next/link";
import { 
  Film, 
  Sparkles, 
  Tv, 
  ShieldCheck, 
  Armchair, 
  Users, 
  Award, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Calendar
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "10+", label: "Năm tiên phong", desc: "Định hình tiêu chuẩn rạp chiếu hiện đại" },
    { value: "1.5M+", label: "Khán giả mỗi năm", desc: "Đồng hành cùng cộng đồng yêu điện ảnh" },
    { value: "100%", label: "Màn chiếu Laser 4K", desc: "Hình ảnh sắc nét và chân thực tối đa" },
    { value: "99.8%", label: "Độ hài lòng", desc: "Dịch vụ và tiện ích chuẩn quốc tế" },
  ];

  const pillars = [
    {
      icon: Tv,
      title: "Công Nghệ Đỉnh Cao",
      desc: "Trang bị màn hình IMAX Laser kích thước khổng lồ, chuyển động sống động với 4DX Motion và âm thanh vòm không gian Dolby Atmos 360°."
    },
    {
      icon: Armchair,
      title: "Trải Nghiệm CyberLounge",
      desc: "Hệ thống ghế bọc da cao cấp chỉnh điện đa hướng, tích hợp sạc không dây, khoảng cách để chân thoải mái và bàn ăn cá nhân sang trọng."
    },
    {
      icon: ShieldCheck,
      title: "Tự Động Hóa Không Chạm",
      desc: "Công nghệ soát vé tự động bằng mã QR chuẩn xác trong 1 giây, loại bỏ hoàn toàn việc xếp hàng chờ in vé giấy truyền thống."
    },
    {
      icon: Film,
      title: "Ẩm Thực Điện Ảnh CyberBites",
      desc: "Thực đơn bắp rang 12 hương vị độc quyền, nước uống pha chế thủ công và các combo phim phiên bản giới hạn độc đáo."
    }
  ];

  const milestones = [
    {
      year: "2016",
      title: "Khởi Đầu Kỷ Nguyên CyberPlex",
      desc: "Khai trương cụm rạp đầu tiên tại Quận 1, TP.HCM với định hướng số hóa toàn diện."
    },
    {
      year: "2019",
      title: "Đột Phá Với Màn Chiếu IMAX Laser",
      desc: "Nâng cấp hệ thống máy chiếu Laser 4K kép và phòng chiếu IMAX quy mô lớn nhất khu vực."
    },
    {
      year: "2023",
      title: "Ra Mắt Cổng Check-In Không Chạm",
      desc: "Ứng dụng cổng soát vé tự động QR Code đầu tiên, rút ngắn 90% thời gian vào rạp của khán giả."
    },
    {
      year: "2026",
      title: "Mạng Lưới Rạp Chiếu Tương Lai",
      desc: "Mở rộng 4 đại cụm rạp tại các trung tâm kinh tế trọng điểm cùng hệ sinh thái đặt vé trực tuyến liền mạch."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary mb-4 box-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VỀ CHÚNG TÔI • CYBERPLEX CINEMAS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-glow text-white mb-6">
            Định Nghĩa Lại Trải Nghiệm Điện Ảnh
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            CyberPlex Cinemas là hệ thống cụm rạp điện ảnh kỹ thuật số thế hệ mới, kết hợp hài hòa giữa đỉnh cao công nghệ trình chiếu hình ảnh, âm thanh tương lai và dịch vụ chuẩn mực.
          </p>
        </div>

        {/* THỐNG KÊ ẤN TƯỢNG */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl"
            >
              <div className="text-3xl sm:text-4xl font-black text-primary text-glow mb-1">
                {s.value}
              </div>
              <div className="text-sm font-bold uppercase text-white mb-1">
                {s.label}
              </div>
              <p className="text-xs text-gray-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* TẦM NHÌN & SỨ MỆNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-surface border border-surface-border rounded-2xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center text-primary mb-5 box-glow">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
                Tầm Nhìn Chiến Lược
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                Trở thành biểu tượng rạp chiếu phim kỹ thuật số thông minh hàng đầu tại Việt Nam và Đông Nam Á, nơi công nghệ phục vụ cảm xúc con người và biến mỗi bộ phim thành một chuyến du hành thị giác chân thực.
              </p>
            </div>
            <div className="pt-4 border-t border-surface-border text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tiêu chuẩn công nghệ quốc tế DCI</span>
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-2xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center text-primary mb-5 box-glow">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
                Sứ Mệnh Phục Vụ
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                Không ngừng nâng tầm trải nghiệm của khán giả thông qua việc liên tục đầu tư nâng cấp hệ thống máy chiếu Laser, âm thanh vòm Dolby Atmos, không gian giải trí sang trọng và quy trình phục vụ không chạm tiện lợi.
              </p>
            </div>
            <div className="pt-4 border-t border-surface-border text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Khán giả là trung tâm phục vụ</span>
            </div>
          </div>
        </div>

        {/* CỘT MỐC PHÁT TRIỂN */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-center tracking-widest text-glow text-white mb-12">
            Hành Trình Phát Triển
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div 
                key={idx}
                className="bg-surface/60 border border-surface-border rounded-2xl p-6 relative flex flex-col justify-between hover:border-primary/50 transition-all"
              >
                <div>
                  <span className="text-2xl font-black text-primary text-glow block mb-2">
                    {m.year}
                  </span>
                  <h3 className="text-base font-bold text-white uppercase mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 GIÁ TRỊ CỐT LÕI */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-center tracking-widest text-glow text-white mb-12">
            Trải Nghiệm Khác Biệt Tại CyberPlex
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 flex gap-5 items-start hover:border-primary/50 transition-all shadow-xl"
                >
                  <div className="p-3 bg-primary/20 border border-primary/40 rounded-xl text-primary shrink-0 box-glow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="bg-gradient-to-r from-surface via-surface-border/40 to-surface border border-primary/40 rounded-3xl p-8 sm:p-12 text-center box-glow shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-white mb-4 text-glow">
            Sẵn Sàng Trải Nghiệm Phim Ngay Hôm Nay?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Xem lịch chiếu hôm nay tại tất cả các cụm rạp CyberPlex và chọn chỗ ngồi đẹp nhất.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/showtimes"
              className="px-6 py-3.5 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all box-glow flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Xem Lịch Chiếu</span>
            </Link>
            <Link 
              href="/theaters"
              className="px-6 py-3.5 bg-background hover:bg-white/10 text-gray-200 border border-surface-border font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Danh Sách Cụm Rạp</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
