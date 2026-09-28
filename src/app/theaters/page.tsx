"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_THEATERS, MOCK_MOVIES, generateMockShowtimesList } from "@/data/mock";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Tv, 
  Armchair, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldCheck, 
  Film
} from "lucide-react";

function TheatersContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "all";

  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedTheaterId, setExpandedTheaterId] = useState<string | null>(null);

  // Danh sách các thành phố duy nhất
  const cities = useMemo(() => {
    return ["all", ...Array.from(new Set(MOCK_THEATERS.map((t) => t.city)))];
  }, []);

  // Lọc rạp theo khu vực và từ khóa tìm kiếm
  const filteredTheaters = useMemo(() => {
    return MOCK_THEATERS.filter((t) => {
      const matchCity = selectedCity === "all" || t.city === selectedCity;
      const q = searchTerm.toLowerCase();
      const matchSearch = 
        !searchTerm.trim() || 
        t.name.toLowerCase().includes(q) || 
        t.address.toLowerCase().includes(q) || 
        t.district.toLowerCase().includes(q);

      return matchCity && matchSearch;
    });
  }, [selectedCity, searchTerm]);

  // Sinh suất chiếu mẫu hôm nay cho rạp khi mở rộng
  const getTodayShowtimesForTheater = (theaterName: string) => {
    const list = generateMockShowtimesList();
    return list.filter((st) => st.theaterName === theaterName);
  };

  const toggleExpand = (theaterId: string) => {
    setExpandedTheaterId((prev) => (prev === theaterId ? null : theaterId));
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Tiêu đề trang */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary mb-4 box-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HỆ THỐNG CỤM RẠP CYBERPLEX</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-glow text-white mb-4">
            Danh Sách Cụm Rạp
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Hệ thống phòng chiếu chuẩn quốc tế trang bị công nghệ IMAX Laser 3D, chuyển động 4DX Motion, âm thanh vòm Dolby Atmos và dịch vụ CyberLounge sang trọng bậc nhất.
          </p>
        </div>

        {/* Thanh điều khiển: Chọn Khu vực & Tìm kiếm */}
        <div className="bg-surface border border-surface-border rounded-2xl p-4 md:p-5 mb-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs Khu vực */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {cities.map((city) => {
              const label = city === "all" ? "Tất cả cụm rạp" : city;
              const count = city === "all" 
                ? MOCK_THEATERS.length 
                : MOCK_THEATERS.filter((t) => t.city === city).length;

              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedCity === city
                      ? "bg-primary text-white box-glow shadow-md"
                      : "bg-background border border-surface-border text-gray-400 hover:text-white hover:border-primary/50"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* Ô Tìm kiếm rạp */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên rạp, quận, đường..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 pl-10 pr-4 rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Không tìm thấy rạp nào */}
        {filteredTheaters.length === 0 && (
          <div className="text-center py-20 bg-surface border border-surface-border rounded-2xl p-8 mb-12">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Không tìm thấy cụm rạp phù hợp</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Không có cụm rạp nào khớp với tiêu chí tìm kiếm của bạn. Vui lòng thử từ khóa khác.
            </p>
            <button
              onClick={() => { setSelectedCity("all"); setSearchTerm(""); }}
              className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-wider box-glow"
            >
              Xem tất cả cụm rạp
            </button>
          </div>
        )}

        {/* DANH SÁCH CÁC CỤM RẠP (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredTheaters.map((theater) => {
            const isExpanded = expandedTheaterId === theater.id;
            const todayShowtimes = isExpanded ? getTodayShowtimesForTheater(theater.name) : [];

            return (
              <div
                key={theater.id}
                className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-primary/50 flex flex-col group"
              >
                {/* Ảnh Bìa Rạp */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent z-10" />
                  <img
                    src={theater.imageUrl}
                    alt={theater.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />

                  {/* Badge Khu vực góc trên */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white shadow-lg">
                      {theater.city} • {theater.district}
                    </span>
                  </div>

                  {/* Quy mô phòng chiếu góc phải */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/90 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-wider box-glow shadow-lg">
                      {theater.totalScreens} Phòng • {theater.totalSeats} Ghế
                    </span>
                  </div>

                  {/* Tên Rạp nổi ở chân ảnh */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider text-glow mb-1">
                      {theater.name}
                    </h2>
                  </div>
                </div>

                {/* Thông tin Chi tiết Rạp */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Địa chỉ */}
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="leading-snug">{theater.address}</span>
                    </div>

                    {/* Hotline & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-gray-400">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <span>Hotline: <strong className="text-white font-medium">{theater.phone}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{theater.email}</span>
                      </div>
                    </div>

                    {/* Các định dạng công nghệ chiếu */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Công nghệ phòng chiếu
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {theater.formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-lg text-xs font-bold text-primary flex items-center gap-1.5"
                          >
                            <Tv className="w-3 h-3" />
                            <span>{fmt}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách Tiện ích */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Tiện ích rạp
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                        {theater.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="pt-4 border-t border-surface-border space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Xem lịch chiếu đầy đủ */}
                      <Link
                        href={`/showtimes?theater=${encodeURIComponent(theater.name)}`}
                        className="py-3 px-4 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all box-glow flex items-center justify-center gap-2 text-center"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Xem Lịch Chiếu</span>
                      </Link>

                      {/* Mở Google Maps */}
                      <a
                        href={theater.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 bg-background hover:bg-white/10 text-gray-300 hover:text-white border border-surface-border font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Xem Bản Đồ</span>
                      </a>
                    </div>

                    {/* Nút mở rộng xem nhanh suất chiếu hôm nay */}
                    <button
                      onClick={() => toggleExpand(theater.id)}
                      className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Thu gọn suất chiếu hôm nay" : "Xem nhanh suất chiếu hôm nay"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Suất chiếu mở rộng ngay tại thẻ rạp */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-surface-border animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>Suất chiếu hôm nay</span>
                        </span>
                        <Link
                          href={`/showtimes?theater=${encodeURIComponent(theater.name)}`}
                          className="text-[11px] text-primary hover:text-white font-bold underline"
                        >
                          Xem các ngày khác →
                        </Link>
                      </div>

                      {todayShowtimes.length === 0 ? (
                        <p className="text-xs text-gray-500 py-3 text-center">
                          Hôm nay chưa có suất chiếu nào được lên lịch tại rạp này.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {/* Nhóm suất chiếu theo phim */}
                          {MOCK_MOVIES.slice(0, 3).map((movie) => {
                            const movieTimes = todayShowtimes.filter((st) => st.movieId === movie.id);
                            if (movieTimes.length === 0) return null;

                            return (
                              <div key={movie.id} className="bg-background/80 p-3 rounded-xl border border-surface-border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-white uppercase truncate max-w-[200px]">
                                    {movie.title}
                                  </span>
                                  <span className="text-[10px] text-primary font-bold">
                                    ★ {movie.rating}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {movieTimes.slice(0, 4).map((st) => (
                                    <Link
                                      key={st.id}
                                      href={`/book/${st.id}`}
                                      className="px-3 py-1.5 bg-surface border border-surface-border hover:border-primary hover:text-primary rounded-lg text-xs font-bold text-gray-200 transition-all"
                                      title={`Đặt vé suất ${st.time}`}
                                    >
                                      {st.time}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CÁC ĐẶC QUYỀN HỆ THỐNG RẠP CYBERPLEX */}
        <div className="border-t border-surface-border pt-16">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-center tracking-widest text-glow text-white mb-12">
            Đẳng Cấp Điện Ảnh CyberPlex
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: IMAX Laser */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl">
              <div className="w-14 h-14 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <Tv className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                Công Nghệ IMAX Laser 3D
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Màn hình kích thước siêu lớn uốn cong cùng hệ thống máy chiếu Laser 4K kép mang đến độ sáng vượt trội, màu sắc chuẩn xác và độ sắc nét tuyệt đối.
              </p>
            </div>

            {/* Box 2: CyberLounge */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl">
              <div className="w-14 h-14 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <Armchair className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                Ghế Ngồi CyberLounge VIP
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Ghế đệm bọc da chỉnh điện đa nấc, tích hợp cổng sạc không dây, khoảng cách để chân siêu rộng và bàn ăn riêng đem lại trải nghiệm thư giãn đẳng cấp.
              </p>
            </div>

            {/* Box 3: Soát vé không chạm */}
            <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl">
              <div className="w-14 h-14 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                Check-in Không Chạm 1 Giây
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Cổng soát vé tự động nhận diện mã QR vé trên điện thoại tức thì, không cần xếp hàng in vé giấy, giúp bạn bước thẳng vào phòng chiếu trong chớp mắt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TheatersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-28 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <TheatersContent />
    </Suspense>
  );
}
