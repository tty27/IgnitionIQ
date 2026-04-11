"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a951' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        <div 
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '20%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '20%',
            right: '20%',
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            animationDelay: '1s'
          }}
        ></div>

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/30 to-transparent rounded-full"
              style={{
                left: `${10 + i * 8}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.4}s`,
                top: '-150px'
              }}
            ></div>
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/30 to-transparent rounded-full"
              style={{
                right: `${10 + i * 8}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.4 + 0.2}s`,
                top: '-150px'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
        
          <div className="inline-flex items-center gap-2 bg-[#c8a951]/10 px-4 py-2 rounded-full border border-[#c8a951]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-[#c8a951] animate-pulse" />
            <span className="text-[#c8a951] font-semibold text-xs tracking-wider uppercase">Secure Login</span>
          </div>

          <h1 className="text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#c8a951] via-[#d9b85c] to-[#c8a951] bg-clip-text text-transparent animate-gradient">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border-2 border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(200,169,81,0.15)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8a951] transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(200,169,81,0.3)]"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8a951] transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(200,169,81,0.3)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#c8a951] to-[#d9b85c] text-black font-bold py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(200,169,81,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d9b85c] to-[#c8a951] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/50 text-gray-500 backdrop-blur-sm">Don't have an account?</span>
            </div>
          </div>

          <Link href="/register">
            <button
              type="button"
              className="w-full border-2 border-[#c8a951]/30 text-[#c8a951] font-bold py-4 rounded-xl hover:bg-[#c8a951]/10 hover:border-[#c8a951] hover:scale-105 transition-all duration-300"
            >
              Create Account
            </button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-[#c8a951] transition-colors inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes roadLine {
          0% { transform: translateY(-150px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}