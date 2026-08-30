"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Search, Filter, Play } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const snapshot = await getDocs(collection(db, "movies"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(data);
      } catch (error) {
        console.error("Lỗi tải danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Extract unique genres for the filter
  const allGenres = ["Tất cả", ...Array.from(new Set(movies.map(m => m.genre?.split('/')[0].trim()).filter(Boolean)))];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          movie.originalTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "Tất cả" || movie.genre?.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header & Controls */}
        <div className="mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow text-white">
            Danh sách phim
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-lg border border-surface-border">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm phim..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-surface-border text-white py-3 pl-12 pr-4 rounded focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <Filter className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider whitespace-nowrap transition-all ${
                    selectedGenre === genre 
                      ? "bg-primary text-white box-glow" 
                      : "bg-background border border-surface-border text-gray-400 hover:text-white hover:border-primary/50"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-4 animate-pulse">
                <div className="bg-surface-border aspect-[2/3] rounded-lg"></div>
                <div className="h-6 bg-surface-border rounded w-3/4"></div>
                <div className="h-4 bg-surface-border rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-20 bg-surface border border-surface-border rounded-lg">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Không tìm thấy phim nào</h3>
            <p className="text-gray-500">Vui lòng thử từ khóa hoặc bộ lọc khác.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedGenre("Tất cả"); }}
              className="mt-6 px-6 py-2 bg-primary/20 text-primary border border-primary/50 rounded hover:bg-primary hover:text-white transition-all font-bold"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && filteredMovies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <Link href={`/movies/${movie.id}`} key={movie.id} className="group relative rounded-md overflow-hidden bg-surface border border-surface-border cursor-pointer hover:border-primary/50 transition-all duration-300">
                <div className="aspect-[2/3] bg-gray-900 relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                   <img 
                     src={movie.posterUrl} 
                     alt={movie.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                   />
                   
                   <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                      <h3 className="font-bold text-lg mb-1 truncate text-white">{movie.title}</h3>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{movie.genre?.split('/')[0]}</span>
                        <span className="text-primary font-bold">★ {movie.rating}</span>
                      </div>
                   </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center justify-center backdrop-blur-sm">
                   <button className="px-6 py-2 border border-primary text-primary group-hover:bg-primary group-hover:text-white font-bold rounded-sm transition-all box-glow uppercase text-sm tracking-wider">
                     Mua vé
                   </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
