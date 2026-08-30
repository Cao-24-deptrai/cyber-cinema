import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-wider text-white">
              CYBER<span className="text-primary">PLEX</span>
            </span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Hỗ trợ</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CYBERPLEX CINEMAS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
