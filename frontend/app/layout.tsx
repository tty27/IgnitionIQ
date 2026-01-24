"use client";

import "./global.css";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, CarFront, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Trophy, BookOpen } from "lucide-react";

function Navigation() {
  const { user, logout, token } = useAuth();
  const pathname = usePathname();
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [userXp, setUserXp] = useState<number | null>(null);

  // ... existing useEffect code ...

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-[#c8a951]/30 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <CarFront className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#c8a951] tracking-wide group-hover:text-[#d9b85c] transition-colors">
            IgnitionIQ
          </h1>
        </div>
      </Link>
      
      {/* NEW: Navigation Links */}
      {user && (
        <div className="hidden md:flex items-center gap-6">
          <Link href="/leaderboard">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-[#c8a951] transition-colors">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </Link>
          <Link href="/review">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-[#c8a951] transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Review</span>
            </button>
          </Link>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* User Profile Button with Level */}
            <Link href="/profile">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#c8a951]/10 rounded-xl border-2 border-[#c8a951]/30 hover:border-[#c8a951] hover:bg-[#c8a951]/20 transition-all cursor-pointer group">
                {/* User Info */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c8a951]" />
                  <span className="text-gray-300 font-medium">{user.name}</span>
                </div>
                
                {/* Divider */}
                <div className="w-px h-6 bg-[#c8a951]/30"></div>
                
                {/* Level Badge */}
                {userLevel !== null && (
                  <div className="flex items-center gap-2 bg-[#c8a951]/20 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-[#c8a951] group-hover:animate-pulse" />
                    <span className="text-[#c8a951] font-bold text-sm">LVL {userLevel}</span>
                  </div>
                )}
                
                {/* XP Badge */}
                {userXp !== null && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-lg">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">{userXp}</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#c8a951]/30 text-[#c8a951] rounded-xl hover:bg-[#c8a951] hover:text-black transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-gray-300 hover:text-[#c8a951] transition-colors">
              Login
            </Link>
            <Link href="/register">
              <button className="px-5 py-2 bg-[#c8a951] text-black rounded-lg hover:bg-[#d9b85c] transition-all font-semibold">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-black/70 border-t border-[#c8a951]/30 text-center py-6 text-sm text-gray-400">
      © {new Date().getFullYear()}{" "}
      <span className="text-[#c8a951]">IgnitionIQ</span>. All rights reserved.
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <AuthProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}