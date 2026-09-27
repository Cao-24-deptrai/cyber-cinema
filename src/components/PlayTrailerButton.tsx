"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

export default function PlayTrailerButton({ 
  trailerId, 
  variant = "default" 
}: { 
  trailerId?: string, 
  variant?: "default" | "circle" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when trailer is open, and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const id = trailerId || "dQw4w9WgXcQ"; // Fallback trailer ID

  return (
    <>
      {variant === "default" ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-sm border border-white/20 hover:bg-white/10 transition-all uppercase tracking-wider cursor-pointer"
        >
          <Play className="w-5 h-5" />
          Xem Trailer
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 rounded-full bg-primary/80 text-white flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 box-glow backdrop-blur-md cursor-pointer"
          title="Xem Trailer"
        >
          <Play className="w-8 h-8 ml-1" fill="currentColor" />
        </button>
      )}

      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl border border-surface-border rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-black/80 hover:bg-primary text-gray-300 hover:text-white transition-all rounded flex items-center gap-1.5 font-bold tracking-widest text-xs uppercase border border-white/20 shadow-lg cursor-pointer"
            >
              ĐÓNG <X className="w-4 h-4" />
            </button>
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${id}?autoplay=1`} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
