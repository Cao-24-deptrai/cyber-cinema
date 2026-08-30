"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";

export default function PlayTrailerButton({ 
  trailerId, 
  variant = "default" 
}: { 
  trailerId?: string, 
  variant?: "default" | "circle" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const id = trailerId || "dQw4w9WgXcQ"; // Fallback trailer ID

  return (
    <>
      {variant === "default" ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-sm border border-white/20 hover:bg-white/10 transition-all uppercase tracking-wider"
        >
          <Play className="w-5 h-5" />
          Xem Trailer
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 rounded-full bg-primary/80 text-white flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 box-glow backdrop-blur-md"
        >
          <Play className="w-8 h-8 ml-1" fill="currentColor" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl border border-surface-border">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold tracking-widest text-sm"
            >
              ĐÓNG <X className="w-6 h-6" />
            </button>
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${id}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
