"use client";

import { useRouter } from "next/navigation";
import { TrafficCone, Gauge, Wrench, ChevronRight, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: TrafficCone,
      title: "Road Signs",
      description: "Master road signs, their meanings, and how they guide safe driving decisions through visual recognition challenges.",
    },
    {
      icon: Gauge,
      title: "Dashboard Indicators",
      description: "Decode dashboard warning lights and learn what to do when they appear — from tire pressure alerts to engine checks.",
    },
    {
      icon: Wrench,
      title: "Car Knowledge",
      description: "Learn essential car facts — from maintenance tips to safety systems like ABS and airbags — to drive smarter and safer.",
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40 px-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8a951]/3 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,81,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,81,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c8a951]/10 border border-[#c8a951]/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#c8a951]" />
              <span className="text-sm font-semibold text-[#c8a951] tracking-wide">Master the Road with Confidence</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12 space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block text-[#c8a951] drop-shadow-[0_0_40px_rgba(200,169,81,0.4)] mb-4">
                IgnitionIQ
              </span>
              <span className="block text-white/90 text-5xl md:text-6xl lg:text-7xl font-bold">
                Fuel Your Knowledge
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
              Learn{" "}
              <span className="text-[#c8a951] font-semibold">road signs</span>,{" "}
              <span className="text-[#c8a951] font-semibold">dashboard indicators</span>, and{" "}
              <span className="text-[#c8a951] font-semibold">car knowledge</span>{" "}
              through interactive quizzes and real-world scenarios.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/game")}
              className="group relative px-10 py-5 bg-[#c8a951] rounded-full font-bold text-xl text-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(200,169,81,0.6)] hover:bg-[#d9b85c]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-[#c8a951] font-semibold text-sm tracking-widest uppercase">What You'll Master</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Three Essential Skills
            </h2>
            <div className="w-24 h-1 bg-[#c8a951] mx-auto"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-b from-[#0a0a0a] to-black rounded-3xl p-10 border border-[#c8a951]/20 hover:border-[#c8a951] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(200,169,81,0.15)]"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-[#c8a951]/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="inline-flex p-5 bg-[#c8a951]/10 rounded-2xl mb-8 group-hover:bg-[#c8a951]/20 group-hover:scale-110 transition-all duration-300 border border-[#c8a951]/30">
                      <Icon className="w-12 h-12 text-[#c8a951]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-5 group-hover:text-[#c8a951] transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-lg font-light">
                      {feature.description}
                    </p>

                    {/* Decorative Line */}
                    <div className="mt-8 h-0.5 w-16 bg-[#c8a951]/50 group-hover:w-full transition-all duration-500"></div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a951]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#c8a951] via-[#d9b85c] to-[#c8a951] rounded-3xl p-16 overflow-hidden shadow-[0_0_100px_rgba(200,169,81,0.3)]">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Ready to Master Driving?
              </h2>
              <p className="text-xl md:text-2xl text-black/80 mb-10 max-w-2xl mx-auto font-light">
                Start your journey to becoming a confident and knowledgeable driver today.
              </p>
              <button
                onClick={() => router.push("/game")}
                className="px-10 py-5 bg-black text-[#c8a951] rounded-full font-bold text-xl hover:bg-black/90 transition-all duration-300 hover:scale-105 shadow-2xl border-2 border-black/20"
              >
                Start Learning Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}