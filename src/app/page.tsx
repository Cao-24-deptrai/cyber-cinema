import Link from "next/link";
import { Play, Ticket, ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PlayTrailerButton from "@/components/PlayTrailerButton";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let movies: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu phim:", error);
  }

  const featuredMovie = movies[0] || null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
          
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" 
            style={{ backgroundImage: `url(${featuredMovie.bannerUrl})` }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(229,9,20,0.2)] z-0" />

          <div className="container relative z-20 mx-auto px-4 text-center mt-16">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium tracking-widest mb-6 box-glow">
              NOW SHOWING
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white text-glow uppercase">
              {featuredMovie.title.split(': ')[0]}: <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">{featuredMovie.title.split(': ')[1] || ''}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 mb-10 text-lg">
              {featuredMovie.synopsis?.substring(0, 150)}...
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={`/movies/${featuredMovie.id}`} 
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-sm hover:bg-primary-glow transition-all box-glow uppercase tracking-wider"
              >
                <Ticket className="w-5 h-5" />
                Đặt vé ngay
              </Link>
              <PlayTrailerButton trailerId={featuredMovie.trailerId} />
            </div>
          </div>
        </section>
      )}

      {/* Now Showing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-glow">
            Đang chiếu
          </h2>
          <Link href="/movies" className="text-primary hover:text-primary-glow font-bold uppercase tracking-widest text-sm transition-all">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
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
      </section>
    </div>
  );
}
