import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyberplex | Phim Tương Lai",
  description: "Trải nghiệm đặt vé xem phim phong cách Cyberpunk viễn tưởng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
        <AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #333',
                textTransform: 'uppercase',
                fontSize: '12px',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
                style: {
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
                style: {
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
