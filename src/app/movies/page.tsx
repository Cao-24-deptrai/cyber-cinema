"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_MOVIES } from "@/data/mock";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Star, 
  ArrowUpDown, 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  Film,
  Sparkles
} from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  
  // Lọc theo thời gian tùy thích (Khoảng ngày & Thời lượng)
  const [durationOption, setDurationOption] = useState("all");
  const [customMinDuration, setCustomMinDuration] = useState("");
  const [customMaxDuration, setCustomMaxDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvancedTime, setShowAdvancedTime] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const snapshot = await getDocs(collection(db, "movies"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setMovies(data);
        } else {
          // Dùng MOCK_MOVIES nếu Firebase chưa có dữ liệu
          setMovies(MOCK_MOVIES);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách phim từ Firebase:", error);
        // Fallback dữ liệu mẫu để giao diện luôn hoạt động ổn định
        setMovies(MOCK_MOVIES);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Trích xuất danh sách thể loại động từ các phim trong Firebase
  const genreList = useMemo(() => {
    const counts: { [key: string]: number } = {};
    movies.forEach((m) => {
      if (!m.genre) return;
      const parts = m.genre.split(/[\/,]/).map((g: string) => g.trim()).filter(Boolean);
      parts.forEach((g: string) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    const sorted = Object.keys(counts).sort((a, b) => a.localeCompare(b, "vi"));
    return sorted.map((g) => ({ name: g, count: counts[g] }));
  }, [movies]);

  // Hàm chuyển đổi chuỗi thời lượng thành số phút (ví dụ "145 phút" -> 145)
  const parseMinutes = (durationStr: any): number => {
    if (typeof durationStr === "number") return durationStr;
    if (!durationStr) return 0;
    const match = String(durationStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Hàm chuyển đổi ngày phát hành thành timestamp để so sánh
  const parseDateTimestamp = (movie: any): number => {
    if (movie.releaseDate) {
      const parsed = Date.parse(movie.releaseDate);
      if (!isNaN(parsed)) return parsed;
    }
    if (movie.createdAt) {
      if (typeof movie.createdAt.toMillis === "function") return movie.createdAt.toMillis();
      const parsed = Date.parse(movie.createdAt);
      if (!isNaN(parsed)) return parsed;
    }
    if (movie.year) {
      return new Date(parseInt(movie.year, 10), 0, 1).getTime();
    }
    const idNum = parseInt(movie.id, 10);
    return !isNaN(idNum) ? idNum * 1000000 : 0;
  };

  // Xử lý Lọc & Sắp xếp phim
  const filteredAndSortedMovies = useMemo(() => {
    let result = movies.filter((movie) => {
      // 1. Tìm kiếm theo tên phim / tên gốc / đạo diễn
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = movie.title?.toLowerCase().includes(query);
        const originalTitleMatch = movie.originalTitle?.toLowerCase().includes(query);
        const directorMatch = movie.director?.toLowerCase().includes(query);
        if (!titleMatch && !originalTitleMatch && !directorMatch) return false;
      }

      // 2. Lọc theo thể loại
      if (selectedGenre !== "all") {
        if (!movie.genre || !movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())) {
          return false;
        }
      }

      // 3. Lọc theo thời lượng phim tùy thích
      const dur = parseMinutes(movie.duration);
      if (durationOption === "under90" && dur >= 90 && dur > 0) return false;
      if (durationOption === "90to120" && (dur < 90 || dur > 120)) return false;
      if (durationOption === "over120" && dur <= 120 && dur > 0) return false;
      if (durationOption === "custom") {
        if (customMinDuration && dur < parseInt(customMinDuration, 10)) return false;
        if (customMaxDuration && dur > parseInt(customMaxDuration, 10)) return false;
      }

      // 4. Lọc theo khoảng ngày khởi chiếu / phát hành
      const movieTimestamp = parseDateTimestamp(movie);
      if (startDate) {
        const startTs = new Date(startDate).getTime();
        if (movieTimestamp && movieTimestamp < startTs) return false;
      }
      if (endDate) {
        const endTs = new Date(endDate).setHours(23, 59, 59, 999);
        if (movieTimestamp && movieTimestamp > endTs) return false;
      }

      return true;
    });

    // Sắp xếp
    result.sort((a, b) => {
      if (sortBy === "rating-desc") {
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      }
      if (sortBy === "rating-asc") {
        return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
      }
      if (sortBy === "date-desc") {
        return parseDateTimestamp(b) - parseDateTimestamp(a);
      }
      if (sortBy === "date-asc") {
        return parseDateTimestamp(a) - parseDateTimestamp(b);
      }
      return 0;
    });

    return result;
  }, [
    movies, 
    searchTerm, 
    selectedGenre, 
    durationOption, 
    customMinDuration, 
    customMaxDuration, 
    startDate, 
    endDate, 
    sortBy
  ]);

  // Đặt lại toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSortBy("default");
    setDurationOption("all");
    setCustomMinDuration("");
    setCustomMaxDuration("");
    setStartDate("");
    setEndDate("");
  };

  const isFilterActive = 
    searchTerm !== "" || 
    selectedGenre !== "all" || 
    sortBy !== "default" || 
    durationOption !== "all" || 
    startDate !== "" || 
    endDate !== "";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Tiêu đề trang */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-glow text-white">
              Danh sách phim
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Khám phá các siêu phẩm điện ảnh với bộ lọc thể loại, thời gian và điểm đánh giá
          </p>
        </div>

        {/* BẢNG BỘ LỌC ĐA NĂNG */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 md:p-6 mb-8 shadow-2xl space-y-5">
          {/* Hàng 1: Tìm kiếm, Dropdown Thể loại (từ Firebase), Dropdown Sắp xếp */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Ô tìm kiếm tên phim */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Tìm kiếm phim
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Nhập tên phim, đạo diễn..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-sm py-2.5 pl-10 pr-4 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* DROPDOWN CÁC THỂ LOẠI LẤY TỪ FIREBASE */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center justify-between">
                <span>Thể loại (Từ Firebase)</span>
                <span className="text-[10px] text-primary lowercase">
                  {genreList.length} thể loại
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-sm py-2.5 px-3.5 rounded-lg focus:border-primary focus:outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="all">Tất cả thể loại ({movies.length})</option>
                  {genreList.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name} ({g.count})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* DROPDOWN SẮP XẾP: ĐÁNH GIÁ CAO/THẤP, MỚI/CŨ */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Sắp xếp theo
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-sm py-2.5 px-3.5 rounded-lg focus:border-primary focus:outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="default">Mặc định (Tất cả)</option>
                  <option value="rating-desc">★ Đánh giá: Cao nhất → Thấp nhất</option>
                  <option value="rating-asc">★ Đánh giá: Thấp nhất → Cao nhất</option>
                  <option value="date-desc">🕒 Mới nhất (Phát hành gần đây)</option>
                  <option value="date-asc">🕒 Cũ nhất (Phát hành trước đây)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Hàng 2: Bộ lọc thời gian tùy thích (Khoảng ngày phát hành & Thời lượng) */}
          <div className="pt-3 border-t border-surface-border/60">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowAdvancedTime(!showAdvancedTime)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Bộ lọc thời gian tùy thích ({durationOption !== "all" || startDate || endDate ? "Đang bật" : "Mở rộng"})</span>
              </button>

              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa tất cả bộ lọc</span>
                </button>
              )}
            </div>

            {/* Chi tiết bộ lọc thời gian */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${showAdvancedTime ? "block" : "hidden sm:grid"}`}>
              {/* Lọc theo thời lượng */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>Thời lượng phim</span>
                </label>
                <select
                  value={durationOption}
                  onChange={(e) => setDurationOption(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-xs py-2 px-3 rounded-md focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả thời lượng</option>
                  <option value="under90">Dưới 90 phút (&lt; 90p)</option>
                  <option value="90to120">90 - 120 phút (Vừa)</option>
                  <option value="over120">Trên 120 phút (&gt; 120p)</option>
                  <option value="custom">Tùy chỉnh số phút...</option>
                </select>
              </div>

              {/* Tùy chỉnh số phút (nếu chọn custom) */}
              {durationOption === "custom" ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Từ (phút)</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={customMinDuration}
                      onChange={(e) => setCustomMinDuration(e.target.value)}
                      className="w-full bg-background border border-surface-border text-white text-xs py-2 px-2.5 rounded-md focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Đến (phút)</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={customMaxDuration}
                      onChange={(e) => setCustomMaxDuration(e.target.value)}
                      className="w-full bg-background border border-surface-border text-white text-xs py-2 px-2.5 rounded-md focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Nút lọc nhanh theo năm */}
                  <div className="w-full">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>Năm phát hành nhanh</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => { setStartDate("2026-01-01"); setEndDate("2026-12-31"); }}
                        className={`py-1.5 px-2 text-xs font-bold rounded border transition-colors ${startDate === "2026-01-01" && endDate === "2026-12-31" ? "bg-primary text-white border-primary" : "bg-background border-surface-border text-gray-300 hover:text-white"}`}
                      >
                        2026
                      </button>
                      <button
                        onClick={() => { setStartDate("2025-01-01"); setEndDate("2025-12-31"); }}
                        className={`py-1.5 px-2 text-xs font-bold rounded border transition-colors ${startDate === "2025-01-01" && endDate === "2025-12-31" ? "bg-primary text-white border-primary" : "bg-background border-surface-border text-gray-300 hover:text-white"}`}
                      >
                        2025
                      </button>
                      <button
                        onClick={() => { setStartDate("2020-01-01"); setEndDate("2024-12-31"); }}
                        className={`py-1.5 px-2 text-xs font-bold rounded border transition-colors ${startDate === "2020-01-01" && endDate === "2024-12-31" ? "bg-primary text-white border-primary" : "bg-background border-surface-border text-gray-300 hover:text-white"}`}
                      >
                        ≤ 2024
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lọc theo ngày bắt đầu */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>Từ ngày khởi chiếu</span>
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-xs py-2 px-3 rounded-md focus:border-primary focus:outline-none"
                />
              </div>

              {/* Lọc theo ngày kết thúc */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>Đến ngày khởi chiếu</span>
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-xs py-2 px-3 rounded-md focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tags hiển thị điều kiện đang lọc */}
          {isFilterActive && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-gray-400 font-medium">Đang lọc:</span>

              {selectedGenre !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/20 text-primary border border-primary/40 rounded-full font-bold">
                  Thể loại: {selectedGenre}
                  <button onClick={() => setSelectedGenre("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {sortBy !== "default" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-border text-gray-200 rounded-full font-medium">
                  {sortBy.includes("rating-desc") && "Đánh giá: Cao nhất"}
                  {sortBy.includes("rating-asc") && "Đánh giá: Thấp nhất"}
                  {sortBy.includes("date-desc") && "Mới nhất"}
                  {sortBy.includes("date-asc") && "Cũ nhất"}
                  <button onClick={() => setSortBy("default")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {durationOption !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-border text-gray-200 rounded-full font-medium">
                  Thời lượng: {durationOption === "under90" ? "< 90 phút" : durationOption === "90to120" ? "90-120 phút" : durationOption === "over120" ? "> 120 phút" : `${customMinDuration || 0} - ${customMaxDuration || '∞'} phút`}
                  <button onClick={() => { setDurationOption("all"); setCustomMinDuration(""); setCustomMaxDuration(""); }} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {(startDate || endDate) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-border text-gray-200 rounded-full font-medium">
                  Ngày: {startDate || "..."} → {endDate || "..."}
                  <button onClick={() => { setStartDate(""); setEndDate(""); }} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              <span className="text-gray-500 ml-auto">
                Tìm thấy <strong>{filteredAndSortedMovies.length}</strong> / {movies.length} phim
              </span>
            </div>
          )}
        </div>

        {/* Trạng thái Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-4 animate-pulse">
                <div className="bg-surface-border aspect-[2/3] rounded-lg"></div>
                <div className="h-5 bg-surface-border rounded w-3/4"></div>
                <div className="h-4 bg-surface-border rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Không tìm thấy phim phù hợp */}
        {!loading && filteredAndSortedMovies.length === 0 && (
          <div className="text-center py-20 bg-surface border border-surface-border rounded-xl">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Không tìm thấy bộ phim nào</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Không có bộ phim nào khớp với các tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-wider box-glow"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Danh sách phim Grid */}
        {!loading && filteredAndSortedMovies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <Link 
                href={`/movies/${movie.id}`} 
                key={movie.id} 
                className="group relative rounded-xl overflow-hidden bg-surface border border-surface-border hover:border-primary/60 transition-all duration-300 shadow-lg flex flex-col"
              >
                {/* Poster Container */}
                <div className="aspect-[2/3] bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                  
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />

                  {/* Badge Đánh giá nổi góc trên */}
                  <div className="absolute top-2.5 right-2.5 z-20 bg-black/80 backdrop-blur-md border border-yellow-500/40 px-2 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating}</span>
                  </div>

                  {/* Badge Độ tuổi */}
                  {movie.ageRestriction && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-black/80 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200">
                      {movie.ageRestriction}
                    </div>
                  )}

                  {/* Thông tin ở chân ảnh poster */}
                  <div className="absolute bottom-0 left-0 p-3.5 z-20 w-full">
                    <h3 className="font-bold text-base md:text-lg mb-1 truncate text-white group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="truncate max-w-[60%]">{movie.genre?.split('/')[0]}</span>
                      <span className="flex items-center gap-1 text-gray-300 shrink-0">
                        <Clock className="w-3 h-3 text-primary" />
                        {movie.duration}
                      </span>
                    </div>

                    {movie.releaseDate && (
                      <div className="mt-1 text-[10px] text-gray-400 font-mono">
                        Khởi chiếu: {movie.releaseDate}
                      </div>
                    )}
                  </div>

                  {/* Lớp phủ Hover "Mua vé" */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center justify-center backdrop-blur-xs">
                    <span className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg transition-all box-glow uppercase text-xs tracking-wider shadow-lg transform group-hover:scale-105 duration-200">
                      Xem chi tiết & Đặt vé
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
