import { notFound } from "next/navigation";
import { Play, Calendar, Clock, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PlayTrailerButton from "@/components/PlayTrailerButton";

export const dynamic = 'force-dynamic';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Fetch movie details
  const movieDoc = await getDoc(doc(db, "movies", id));
  if (!movieDoc.exists()) {
    notFound();
  }
  const movie = { id: movieDoc.id, ...movieDoc.data() } as any;

  // 2. Fetch showtimes for this movie
  const showtimesQuery = query(collection(db, "showtimes"), where("movieId", "==", id));
  const showtimesSnapshot = await getDocs(showtimesQuery);
  const showtimes: any[] = [];
  showtimesSnapshot.forEach(doc => showtimes.push({ id: doc.id, ...doc.data() }));

  // Group showtimes by theater and format
  const groupedShowtimes: any = {};
  showtimes.forEach(st => {
    if (!groupedShowtimes[st.theaterName]) {
      groupedShowtimes[st.theaterName] = { address: st.address, formats: {} };
    }
    if (!groupedShowtimes[st.theaterName].formats[st.format]) {
      groupedShowtimes[st.theaterName].formats[st.format] = [];
    }
    groupedShowtimes[st.theaterName].formats[st.format].push({ id: st.id, time: st.time });
  });

  // Sort times
  Object.keys(groupedShowtimes).forEach(theater => {
    Object.keys(groupedShowtimes[theater].formats).forEach(format => {
      groupedShowtimes[theater].formats[format].sort((a: any, b: any) => a.time.localeCompare(b.time));
    });
  });

  const dates = [
    { day: "Hôm nay", date: "28/08", active: true },
    { day: "Ngày mai", date: "29/08", active: false },
    { day: "Thứ 4", date: "30/08", active: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
          style={{ backgroundImage: `url(${movie.bannerUrl})` }}
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <PlayTrailerButton trailerId={movie.trailerId} variant="circle" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-30 -mt-32 md:-mt-48">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 shrink-0">
            <div className="rounded-md overflow-hidden border border-surface-border box-glow shadow-2xl">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
            </div>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className="px-2 py-1 bg-surface border border-surface-border rounded text-xs font-bold text-gray-300">{movie.ageRestriction}</span>
               <span className="px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-xs font-bold">{movie.genre}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-glow">{movie.title}</h1>
            <p className="text-xl text-gray-400 mb-6 italic">{movie.originalTitle}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8 bg-surface/50 p-4 rounded-md border border-surface-border backdrop-blur-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span>{movie.duration}</span></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /><span><strong className="text-white text-base">{movie.rating}</strong> / 10</span></div>
              <div><span className="text-gray-500">Đạo diễn:</span> <span className="text-white">{movie.director}</span></div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2 border-b border-surface-border pb-2 inline-block">Nội dung phim</h3>
              <p className="text-gray-400 leading-relaxed">{movie.synopsis}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-surface-border pt-12">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 text-glow">
            <Calendar className="w-8 h-8 text-primary" />
            LỊCH CHIẾU
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {dates.map((d, i) => (
              <button key={i} className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-md border transition-all ${d.active ? 'bg-primary border-primary text-white box-glow' : 'bg-surface border-surface-border text-gray-400 hover:border-primary/50 hover:text-white'}`}>
                <span className="text-xs uppercase font-medium">{d.day}</span>
                <span className="text-xl font-bold mt-1">{d.date}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {Object.keys(groupedShowtimes).map((theaterName, i) => (
              <div key={i} className="bg-surface border border-surface-border rounded-md p-6">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{theaterName}</h3>
                    <p className="text-sm text-gray-400 mt-1">{groupedShowtimes[theaterName].address}</p>
                  </div>
                </div>
                <div className="space-y-6 pl-9">
                  {Object.keys(groupedShowtimes[theaterName].formats).map((format, j) => (
                    <div key={j}>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">{format}</h4>
                      <div className="flex flex-wrap gap-3">
                        {groupedShowtimes[theaterName].formats[format].map((st: any) => (
                          <Link key={st.id} href={`/book/${st.id}`} className="px-6 py-2 bg-background border border-surface-border rounded text-white font-medium hover:border-primary hover:text-primary transition-colors focus:box-glow">
                            {st.time}
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
      </div>
    </div>
  );
}
