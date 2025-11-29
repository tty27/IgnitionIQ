"use client";
import { ArrowLeft, TrafficCone, Gauge, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GameMode() {
  const router = useRouter();

  const handleSelect = (mode: string) => {
    router.push(`/quiz/${mode}`);
  };

  const modes = [
    {
      name: "road-signs",
      title: "Road Signs",
      desc: "Test your knowledge of road signs and their meanings.",
      icon: TrafficCone,
      gradient: "from-[#c8a951]/20 to-[#c8a951]/5"
    },
    {
      name: "dashboard",
      title: "Dashboard Indicators",
      desc: "Identify dashboard warning lights and what they mean.",
      icon: Gauge,
      gradient: "from-[#c8a951]/20 to-[#c8a951]/5"
    },
    {
      name: "car-knowledge",
      title: "Car Knowledge",
      desc: "Learn about car parts, safety, and basic maintenance.",
      icon: Wrench,
      gradient: "from-[#c8a951]/20 to-[#c8a951]/5"
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-[var(--foreground)] py-20 px-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,81,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,81,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-0 left-0 flex items-center gap-2 border-2 border-[var(--accent)]/30 text-[var(--accent)] px-5 py-2.5 rounded-xl hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all duration-300 hover:scale-105 font-semibold backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-20 mt-16">
          <div className="inline-block mb-6">
            <span className="text-[#c8a951] font-semibold text-sm tracking-widest uppercase">Select Your Challenge</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-[0_0_30px_rgba(200,169,81,0.3)]">
            Choose Your Path
          </h1>
          <div className="w-24 h-1 bg-[#c8a951] mx-auto mb-8"></div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Select a mode below to start your learning journey. Each challenge offers unique insights to help you master driving awareness and car knowledge.
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.name}
                onClick={() => handleSelect(mode.name)}
                className="group relative bg-gradient-to-b from-[#0a0a0a] to-black rounded-3xl p-10 border-2 border-[var(--accent)]/30 hover:border-[var(--accent)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(200,169,81,0.3)] text-left overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a951]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="inline-flex p-5 bg-[#c8a951]/10 rounded-2xl mb-6 group-hover:bg-[#c8a951]/20 group-hover:scale-110 transition-all duration-300 border border-[#c8a951]/30">
                    <Icon className="w-12 h-12 text-[#c8a951]" />
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[#c8a951] transition-colors duration-300">
                    {mode.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed text-lg mb-6 font-light">
                    {mode.desc}
                  </p>

                  {/* Action Indicator */}
                  <div className="flex items-center gap-2 text-[#c8a951] font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Start Quiz</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>

                  {/* Decorative Line */}
                  <div className="mt-6 h-0.5 w-16 bg-[#c8a951]/50 group-hover:w-full transition-all duration-500"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}