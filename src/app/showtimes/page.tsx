"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOCK_MOVIES, MOCK_THEATERS, generateMockShowtimesList } from "@/data/mock";
import Link from "next/link";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Star, 
  Search, 
  Film, 
  SlidersHorizontal, 
  RotateCcw, 
  Tv, 
  ChevronRight,
  Sparkles
} from "lucide-react";

// Tạo danh sách 10 ngày liên tiếp bắt đầu từ hôm nay
function generateUpcomingDates(count = 10) {
  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const list = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayOfMonth = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const fullDate = `${dayOfMonth}/${month}`;

    let label = daysOfWeek[d.getDay()];
    if (i === 0) label = "Hôm nay";
    else if (i === 1) label = "Ngày mai";

    list.push({
      label,
      fullDate,
      dateNum: dayOfMonth,
      month: `Th${month}`,
      isoDate: d.toISOString().split("T")[0]
    });
  }
  return list;
}

function ShowtimesContent() {
  const searchParams = useSearchParams();
  const initialTheater = searchParams.get("theater") || "all";
  const initialMovieId = searchParams.get("movieId") || "all";
  const initialDate = searchParams.get("date") || "";

  const availableDates = useMemo(() => generateUpcomingDates(10), []);

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || availableDates[0].fullDate
  );
  const [selectedTheater, setSelectedTheater] = useState<string>(initialTheater);
  const [selectedMovie, setSelectedMovie] = useState<string>(initialMovieId);
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"by-movie" | "by-theater">("by-movie");

  const [movies, setMovies] = useState<any[]>([]);
  const [rawShowtimes, setRawShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ Firebase hoặc Mock
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Phim
        const mSnap = await getDocs(collection(db, "movies"));
        const movieList: any[] = [];
        mSnap.forEach((doc) => movieList.push({ id: doc.id, ...doc.data() }));
        const finalMovies = movieList.length > 0 ? movieList : MOCK_MOVIES;
        setMovies(finalMovies);

        // 2. Lịch chiếu
        const stSnap = await getDocs(collection(db, "showtimes"));
        const stList: any[] = [];
        stSnap.forEach((doc) => {
          const data = doc.data();
          const movie = finalMovies.find((m) => m.id === data.movieId);
          stList.push({
            id: doc.id,
            movieTitle: movie?.title || "Phim CyberPlex",
            posterUrl: movie?.posterUrl || "",
            rating: movie?.rating || "8.5",
            ageRestriction: movie?.ageRestriction || "T16",
            duration: movie?.duration || "120 phút",
            genre: movie?.genre || "Hành động / Viễn tưởng",
            ...data
          });
        });

        if (stList.length > 0) {
          setRawShowtimes(stList);
        } else {
          // Fallback sang mock showtimes phong phú
          setRawShowtimes(generateMockShowtimesList(selectedDate));
        }
      } catch (err) {
        console.warn("Lỗi tải lịch chiếu, dùng dữ liệu mẫu:", err);
        setMovies(MOCK_MOVIES);
        setRawShowtimes(generateMockShowtimesList(selectedDate));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedDate]);

  // Cập nhật khi searchParams thay đổi
  useEffect(() => {
    if (initialTheater && initialTheater !== "all") {
      setSelectedTheater(initialTheater);
    }
    if (initialMovieId && initialMovieId !== "all") {
      setSelectedMovie(initialMovieId);
    }
  }, [initialTheater, initialMovieId]);

  // Danh sách các rạp có trong hệ thống
  const allTheaters = useMemo(() => {
    const list = Array.from(new Set(rawShowtimes.map((st) => st.theaterName).filter(Boolean)));
    if (list.length === 0) {
      return MOCK_THEATERS.map((t) => t.name);
    }
    return list;
  }, [rawShowtimes]);

  // Danh sách các định dạng phòng chiếu
  const allFormats = useMemo(() => {
    return Array.from(new Set(rawShowtimes.map((st) => st.format).filter(Boolean)));
  }, [rawShowtimes]);

  // Lọc danh sách suất chiếu
  const filteredShowtimes = useMemo(() => {
    return rawShowtimes.filter((st) => {
      // 1. Lọc theo ngày (nếu dữ liệu có ngày cụ thể, còn nếu là mock thì map linh hoạt)
      if (st.date && st.date !== selectedDate && !st.id.startsWith("st_")) {
        return false;
      }

      // 2. Lọc theo cụm rạp
      if (selectedTheater !== "all" && st.theaterName !== selectedTheater) {
        return false;
      }

      // 3. Lọc theo phim
      if (selectedMovie !== "all" && st.movieId !== selectedMovie) {
        return false;
      }

      // 4. Lọc theo định dạng
      if (selectedFormat !== "all" && st.format !== selectedFormat) {
        return false;
      }

      // 5. Tìm kiếm từ khóa
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = st.movieTitle?.toLowerCase().includes(q);
        const matchTheater = st.theaterName?.toLowerCase().includes(q);
        if (!matchTitle && !matchTheater) return false;
      }

      return true;
    });
  }, [rawShowtimes, selectedDate, selectedTheater, selectedMovie, selectedFormat, searchTerm]);

  // Cấu trúc nhóm suất chiếu theo Phim
  const showtimesByMovie = useMemo(() => {
    const map = new Map<string, { movie: any; theaters: Map<string, Map<string, any[]>> }>();

    filteredShowtimes.forEach((st) => {
      if (!map.has(st.movieId)) {
        const movieInfo = movies.find((m) => m.id === st.movieId) || {
          id: st.movieId,
          title: st.movieTitle,
          posterUrl: st.posterUrl,
          rating: st.rating,
          ageRestriction: st.ageRestriction,
          duration: st.duration,
          genre: st.genre
        };
        map.set(st.movieId, { movie: movieInfo, theaters: new Map() });
      }

      const movieEntry = map.get(st.movieId)!;
      if (!movieEntry.theaters.has(st.theaterName)) {
        movieEntry.theaters.set(st.theaterName, new Map());
      }

      const theaterEntry = movieEntry.theaters.get(st.theaterName)!;
      if (!theaterEntry.has(st.format)) {
        theaterEntry.set(st.format, []);
      }

      theaterEntry.get(st.format)!.push(st);
    });

    return Array.from(map.values()).map((entry) => ({
      movie: entry.movie,
      theaters: Array.from(entry.theaters.entries()).map(([theaterName, formatsMap]) => ({
        theaterName,
        address: MOCK_THEATERS.find((t) => t.name === theaterName)?.address || "CyberPlex Cinema",
        formats: Array.from(formatsMap.entries()).map(([formatName, times]) => ({
          formatName,
          times: times.sort((a, b) => a.time.localeCompare(b.time))
        }))
      }))
    }));
  }, [filteredShowtimes, movies]);

  // Cấu trúc nhóm suất chiếu theo Cụm Rạp
  const showtimesByTheater = useMemo(() => {
    const map = new Map<string, { theaterName: string; address: string; movies: Map<string, Map<string, any[]>> }>();

    filteredShowtimes.forEach((st) => {
      if (!map.has(st.theaterName)) {
        const tInfo = MOCK_THEATERS.find((t) => t.name === st.theaterName);
        map.set(st.theaterName, {
          theaterName: st.theaterName,
          address: tInfo?.address || st.address || "Hệ thống rạp CyberPlex",
          movies: new Map()
        });
      }

      const theaterEntry = map.get(st.theaterName)!;
      if (!theaterEntry.movies.has(st.movieId)) {
        theaterEntry.movies.set(st.movieId, new Map());
      }

      const movieEntry = theaterEntry.movies.get(st.movieId)!;
      if (!movieEntry.has(st.format)) {
        movieEntry.set(st.format, []);
      }

      movieEntry.get(st.format)!.push(st);
    });

    return Array.from(map.values()).map((entry) => ({
      theaterName: entry.theaterName,
      address: entry.address,
      movies: Array.from(entry.movies.entries()).map(([movieId, formatsMap]) => {
        const movieInfo = movies.find((m) => m.id === movieId) || {
          id: movieId,
          title: "Phim CyberPlex",
          rating: "8.5",
          duration: "120 phút",
          genre: "Khoa học viễn tưởng"
        };
        return {
          movie: movieInfo,
          formats: Array.from(formatsMap.entries()).map(([formatName, times]) => ({
            formatName,
            times: times.sort((a, b) => a.time.localeCompare(b.time))
          }))
        };
      })
    }));
  }, [filteredShowtimes, movies]);

  const handleResetFilters = () => {
    setSelectedTheater("all");
    setSelectedMovie("all");
    setSelectedFormat("all");
    setSearchTerm("");
  };

  const isFilterActive =
    selectedTheater !== "all" ||
    selectedMovie !== "all" ||
    selectedFormat !== "all" ||
    searchTerm !== "";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Tiêu đề trang */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarDays className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-glow text-white">
                Lịch Chiếu Phim
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base">
              Theo dõi lịch chiếu, chọn rạp và đặt chỗ ngồi yêu thích nhanh chóng
            </p>
          </div>

          {/* Nút chuyển đổi View Mode */}
          <div className="flex items-center bg-surface border border-surface-border rounded-xl p-1 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode("by-movie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "by-movie"
                  ? "bg-primary text-white box-glow shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Theo Phim</span>
            </button>
            <button
              onClick={() => setViewMode("by-theater")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "by-theater"
                  ? "bg-primary text-white box-glow shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Theo Rạp</span>
            </button>
          </div>
        </div>

        {/* THANH CHỌN NGÀY CHIẾU (DATE SELECTOR) */}
        <div className="bg-surface border border-surface-border rounded-2xl p-3 md:p-4 mb-6 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {availableDates.map((item) => {
              const isActive = selectedDate === item.fullDate;
              return (
                <button
                  key={item.fullDate}
                  onClick={() => setSelectedDate(item.fullDate)}
                  className={`flex flex-col items-center justify-center min-w-[76px] sm:min-w-[90px] py-2.5 sm:py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary border-primary text-white box-glow shadow-lg transform scale-105"
                      : "bg-background/80 border-surface-border text-gray-400 hover:text-white hover:border-primary/50"
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight text-glow">
                    {item.dateNum}
                  </span>
                  <span className="text-[10px] text-gray-400 opacity-80">
                    {item.month}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BỘ LỌC CHI TIẾT */}
        <div className="bg-surface border border-surface-border rounded-xl p-4 md:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Lọc theo Cụm Rạp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Cụm rạp</span>
              </label>
              <select
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3 rounded-lg focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả cụm rạp</option>
                {allTheaters.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo Phim */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-primary" />
                <span>Chọn phim</span>
              </label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3 rounded-lg focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả phim ({movies.length})</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo Định dạng */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-primary" />
                <span>Định dạng phòng chiếu</span>
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3 rounded-lg focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả định dạng</option>
                {allFormats.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </div>

            {/* Tìm kiếm */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Tìm kiếm</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên phim, rạp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 pl-3 pr-8 rounded-lg focus:border-primary focus:outline-none"
                />
                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    title="Đặt lại bộ lọc"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface border border-surface-border rounded-xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-surface-border rounded w-1/4"></div>
                <div className="h-10 bg-surface-border rounded w-1/2"></div>
                <div className="h-12 bg-surface-border rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredShowtimes.length === 0 && (
          <div className="text-center py-20 bg-surface border border-surface-border rounded-2xl p-8">
            <CalendarDays className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Không có suất chiếu phù hợp</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Không tìm thấy suất chiếu nào trong ngày <strong>{selectedDate}</strong> với các tiêu chí lọc bạn đã chọn.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/50 rounded-lg hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-wider box-glow"
            >
              Xem tất cả suất chiếu
            </button>
          </div>
        )}

        {/* DANH SÁCH SUẤT CHIẾU: CHẾ ĐỘ XEM THEO PHIM */}
        {!loading && viewMode === "by-movie" && showtimesByMovie.length > 0 && (
          <div className="space-y-8">
            {showtimesByMovie.map(({ movie, theaters }) => (
              <div
                key={movie.id}
                className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-primary/40"
              >
                {/* Header Phim */}
                <div className="p-5 sm:p-6 bg-surface-border/20 border-b border-surface-border flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    {movie.posterUrl && (
                      <Link href={`/movies/${movie.id}`} className="shrink-0 group">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg border border-surface-border group-hover:border-primary transition-all shadow-md"
                        />
                      </Link>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/40 rounded text-[10px] font-black uppercase">
                          {movie.ageRestriction || "T16"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {movie.genre}
                        </span>
                      </div>
                      <Link href={`/movies/${movie.id}`} className="hover:text-primary transition-colors">
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-glow">
                          {movie.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {movie.duration}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/movies/${movie.id}`}
                    className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider flex items-center gap-1 self-end sm:self-center"
                  >
                    <span>Chi tiết phim</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Danh sách các cụm rạp chiếu phim này */}
                <div className="p-5 sm:p-6 space-y-6 divide-y divide-surface-border/50">
                  {theaters.map((t, idx) => (
                    <div key={t.theaterName} className={idx > 0 ? "pt-6" : ""}>
                      <div className="flex items-start gap-2.5 mb-4">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-white text-base sm:text-lg uppercase">
                            {t.theaterName}
                          </h3>
                          <p className="text-xs text-gray-400">{t.address}</p>
                        </div>
                      </div>

                      {/* Các định dạng & giờ chiếu */}
                      <div className="space-y-4 sm:pl-7">
                        {t.formats.map((fmt) => (
                          <div key={fmt.formatName}>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2.5 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span>{fmt.formatName}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                              {fmt.times.map((st: any) => (
                                <Link
                                  key={st.id}
                                  href={`/book/${st.id}`}
                                  className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-background border border-surface-border rounded-xl text-center hover:border-primary hover:bg-primary/10 transition-all box-glow shadow-sm flex flex-col items-center"
                                  title={`Đặt vé suất ${st.time}`}
                                >
                                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">
                                    {st.time}
                                  </span>
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300">
                                    Đặt chỗ
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DANH SÁCH SUẤT CHIẾU: CHẾ ĐỘ XEM THEO RẠP */}
        {!loading && viewMode === "by-theater" && showtimesByTheater.length > 0 && (
          <div className="space-y-8">
            {showtimesByTheater.map(({ theaterName, address, movies: theaterMovies }) => (
              <div
                key={theaterName}
                className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-primary/40"
              >
                {/* Header Cụm Rạp */}
                <div className="p-5 sm:p-6 bg-surface-border/30 border-b border-surface-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/20 border border-primary/40 rounded-xl text-primary box-glow">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-glow">
                        {theaterName}
                      </h2>
                      <p className="text-xs text-gray-400">{address}</p>
                    </div>
                  </div>

                  <Link
                    href={`/theaters`}
                    className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Thông tin rạp</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Danh sách phim tại rạp này */}
                <div className="p-5 sm:p-6 space-y-6 divide-y divide-surface-border/50">
                  {theaterMovies.map(({ movie, formats }, idx) => (
                    <div key={movie.id} className={idx > 0 ? "pt-6" : ""}>
                      <div className="flex items-center gap-3 mb-4">
                        {movie.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded-lg border border-surface-border shadow"
                          />
                        )}
                        <div>
                          <Link href={`/movies/${movie.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-bold text-white text-base sm:text-lg uppercase">
                              {movie.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span>{movie.duration}</span>
                            <span className="text-yellow-400 font-bold">★ {movie.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Các định dạng & suất chiếu */}
                      <div className="space-y-4 sm:pl-15">
                        {formats.map((fmt) => (
                          <div key={fmt.formatName}>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span>{fmt.formatName}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                              {fmt.times.map((st: any) => (
                                <Link
                                  key={st.id}
                                  href={`/book/${st.id}`}
                                  className="group px-4 sm:px-5 py-2 sm:py-2.5 bg-background border border-surface-border rounded-xl text-center hover:border-primary hover:bg-primary/10 transition-all box-glow shadow-sm flex flex-col items-center"
                                  title={`Đặt vé suất ${st.time}`}
                                >
                                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">
                                    {st.time}
                                  </span>
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300">
                                    Đặt chỗ
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-28 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <ShowtimesContent />
    </Suspense>
  );
}
