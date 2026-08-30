"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cyberplex.com";
      
      if (user.email === adminEmail) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cyberplex.com";
      if (email === adminEmail) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email hoặc mật khẩu không chính xác.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email này đã được sử dụng.");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] z-0" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter text-glow uppercase mb-2">
            CYBER<span className="text-primary">PLEX</span>
          </Link>
          <p className="text-gray-400 tracking-widest text-sm uppercase">Cổng kết nối hệ thống</p>
        </div>

        <div className="bg-surface/80 backdrop-blur-xl border border-surface-border p-8 rounded-lg shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${isLogin ? 'border-primary text-white text-glow' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${!isLogin ? 'border-primary text-white text-glow' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Đăng ký mới
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Thẻ Định Danh (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-surface-border focus:border-primary text-white rounded p-3 pl-10 transition-all focus:box-glow outline-none placeholder:text-gray-600"
                  placeholder="agent@cyberplex.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Khóa Bảo Mật (Mật khẩu)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-surface-border focus:border-primary text-white rounded p-3 pl-10 transition-all focus:box-glow outline-none placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-glow text-white font-bold py-3 rounded uppercase tracking-widest transition-all box-glow flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="animate-pulse">Đang kết nối...</span>
              ) : (
                <>
                  {isLogin ? "Kích hoạt phiên" : "Khởi tạo tài khoản"}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px bg-surface-border flex-1"></div>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Hoặc</span>
            <div className="h-px bg-surface-border flex-1"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mt-6 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded tracking-widest transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            TIẾP TỤC VỚI GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}

