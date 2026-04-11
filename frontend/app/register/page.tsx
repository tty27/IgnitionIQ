"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Medium' : password.length > 0 ? 'Weak' : '';
  const strengthColor = passwordStrength === 'Strong' ? 'text-green-400' : passwordStrength === 'Medium' ? 'text-yellow-400' : 'text-red-400';

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
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '20%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
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

      <div className="relative z-10 w-full max-w-md mt-6">
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-[#c8a951]/10 px-4 py-2 rounded-full border border-[#c8a951]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-[#c8a951] animate-pulse" />
            <span className="text-[#c8a951] font-semibold text-xs tracking-wider uppercase">Join IgnitionIQ</span>
          </div>

          <h1 className="text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#c8a951] via-[#d9b85c] to-[#c8a951] bg-clip-text text-transparent animate-gradient">
              Create Account
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Join IgnitionIQ and start learning today</p>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border-2 border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.15)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8a951] transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
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
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  placeholder="••••••••"
                />
              </div>
              {password && (
                <div className="flex items-center gap-2 text-xs mt-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 'Strong' ? 'bg-green-400 w-full' : 
                        passwordStrength === 'Medium' ? 'bg-yellow-400 w-2/3' : 
                        'bg-red-400 w-1/3'
                      }`}
                    ></div>
                  </div>
                  <span className={`${strengthColor} font-semibold`}>{passwordStrength}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8a951] transition-colors" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-black/50 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#c8a951] transition-all focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  placeholder="••••••••"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#c8a951] to-[#c8a951] text-black font-bold py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c8a951] to-[#c8a951] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/50 text-gray-500 backdrop-blur-sm">Already have an account?</span>
            </div>
          </div>

          <Link href="/login">
            <button
              type="button"
              className="w-full border-2 border-[#c8a951]/30 text-[#c8a951] font-bold py-4 rounded-xl hover:bg-[#c8a951]/10 hover:border-[#c8a951] hover:scale-105 transition-all duration-300"
            >
              Sign In
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