import React from "react";
import { IMAGES } from "../data/mockData";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame, Zap } from "lucide-react";

interface LandingPageProps {
  onStartOnboarding: () => void;
  onSeeDemo: () => void;
  onExploreFeatures: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onSeeDemo,
  onExploreFeatures,
}) => {
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#faf8ff] text-[#131b2e]">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-[#f2f3ff] min-h-[720px] flex items-center justify-center py-16 px-4 md:px-10">
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center w-full h-full opacity-20"
              style={{ backgroundImage: `url('${IMAGES.heroBg}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf8ff]/80 to-[#f2f3ff]/95" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 bg-[#c1f100]/30 text-[#546b00] border border-[#c1f100] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#506600]" />
              Next-Gen Fitness Intelligence
            </div>

            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#131b2e] max-w-3xl leading-tight tracking-tight">
              Train Smarter. Eat Better.{" "}
              <span className="text-[#003ec7]">Achieve Your Goals.</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#434656] max-w-2xl leading-relaxed">
              AI-powered personalized fitness and nutrition recommendations designed around your goals, preferences, and fitness level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md justify-center">
              <button
                onClick={onStartOnboarding}
                className="bg-[#003ec7] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#003ec7]/25 hover:bg-[#0052ff] transition-all active:scale-95 text-base sm:text-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                Get My Personalized Plan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onSeeDemo}
                className="bg-white text-[#003ec7] border-2 border-[#003ec7] font-semibold px-8 py-4 rounded-full hover:bg-[#eaedff] transition-all active:scale-95 text-base sm:text-lg cursor-pointer"
              >
                See Demo
              </button>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl">
              <div className="bg-white rounded-xl p-6 border border-[#c3c5d9] shadow-sm flex flex-col items-center hover:border-[#003ec7]/40 transition-colors">
                <span className="font-headline text-2xl md:text-3xl font-bold text-[#003ec7]">
                  500k+
                </span>
                <span className="text-xs font-medium text-[#434656] mt-1">
                  Workouts Generated
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#c3c5d9] shadow-sm flex flex-col items-center hover:border-[#003ec7]/40 transition-colors">
                <span className="font-headline text-2xl md:text-3xl font-bold text-[#003ec7]">
                  98%
                </span>
                <span className="text-xs font-medium text-[#434656] mt-1">
                  Goal Achievement
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#c3c5d9] shadow-sm flex flex-col items-center hover:border-[#003ec7]/40 transition-colors">
                <span className="font-headline text-2xl md:text-3xl font-bold text-[#003ec7]">
                  24/7
                </span>
                <span className="text-xs font-medium text-[#434656] mt-1">
                  AI Assistance
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 md:px-10 bg-[#faf8ff]" id="how-it-works">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#131b2e]">
                How FitAI Works
              </h3>
              <p className="text-base text-[#434656] mt-2">
                Your journey to peak performance in 3 simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {/* Connecting Line for Desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#c3c5d9] -z-0 transform -translate-y-1/2" />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/60 shadow-sm relative group hover:shadow-md transition-all z-10">
                <div className="w-16 h-16 rounded-full bg-[#0052ff] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">assignment</span>
                </div>
                <h4 className="font-headline font-bold text-[#131b2e] mb-1.5 text-lg">
                  1. Profile Creation
                </h4>
                <p className="text-sm text-[#434656] leading-relaxed">
                  Input your goals, fitness level, and dietary preferences for a tailored baseline.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/60 shadow-sm relative group hover:shadow-md transition-all z-10">
                <div className="w-16 h-16 rounded-full bg-[#c1f100] text-[#546b00] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h4 className="font-headline font-bold text-[#131b2e] mb-1.5 text-lg">
                  2. AI Generation
                </h4>
                <p className="text-sm text-[#434656] leading-relaxed">
                  Our advanced algorithms create optimized workout and nutrition plans instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/60 shadow-sm relative group hover:shadow-md transition-all z-10">
                <div className="w-16 h-16 rounded-full bg-[#c02f09] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">monitoring</span>
                </div>
                <h4 className="font-headline font-bold text-[#131b2e] mb-1.5 text-lg">
                  3. Track & Adapt
                </h4>
                <p className="text-sm text-[#434656] leading-relaxed">
                  Log your progress. The AI continuously adjusts your plan to ensure constant improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Bento Grid */}
        <section className="py-20 px-4 md:px-10 bg-white" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#131b2e]">
                  Key Features
                </h3>
                <p className="text-base text-[#434656] mt-2">
                  Designed for high-performance results.
                </p>
              </div>
              <button
                onClick={onExploreFeatures}
                className="text-[#003ec7] font-semibold flex items-center gap-1 hover:bg-[#eaedff] px-4 py-2 rounded-full transition-colors w-max cursor-pointer"
              >
                Explore all features{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Feature 1 (Large) */}
              <div className="col-span-1 md:col-span-2 row-span-2 bg-[#faf8ff] rounded-2xl border border-[#c3c5d9] overflow-hidden flex flex-col group relative shadow-sm">
                <div className="p-8 flex-grow z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">fitness_center</span>
                  </div>
                  <h4 className="font-headline text-2xl font-bold text-[#131b2e] mb-3">
                    Dynamic AI Workouts
                  </h4>
                  <p className="text-sm sm:text-base text-[#434656] leading-relaxed mb-6 max-w-sm">
                    Workouts that evolve with you. The engine analyzes your past performance, current fatigue levels, and long-term goals to generate the perfect session every day.
                  </p>
                </div>
                <div className="h-56 w-full relative mt-auto z-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                  <div
                    className="bg-cover bg-top w-full h-full"
                    style={{ backgroundImage: `url('${IMAGES.featureWorkouts}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#faf8ff] to-transparent" />
                </div>
              </div>

              {/* Feature 2: Smart Nutrition */}
              <div className="col-span-1 md:col-span-2 bg-[#faf8ff] rounded-2xl border border-[#c3c5d9] p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-[#003ec7]/50 transition-colors shadow-sm">
                <div className="flex-grow">
                  <div className="w-11 h-11 rounded-xl bg-[#c1f100] text-[#546b00] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-xl">restaurant</span>
                  </div>
                  <h4 className="font-headline font-bold text-[#131b2e] mb-1 text-lg">
                    Smart Nutrition
                  </h4>
                  <p className="text-sm text-[#434656] leading-relaxed">
                    Macro-perfected meal plans generated to support your training volume and muscle recovery.
                  </p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-[#c1f100] flex items-center justify-center flex-shrink-0 relative bg-white shadow-inner">
                  <span className="font-headline font-bold text-xl text-[#131b2e]">
                    84%
                  </span>
                  <span className="absolute -bottom-2 bg-white border border-[#c3c5d9] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#546b00]">
                    Protein
                  </span>
                </div>
              </div>

              {/* Feature 3: Progress Analytics */}
              <div className="col-span-1 md:col-span-2 bg-[#faf8ff] rounded-2xl border border-[#c3c5d9] p-6 flex flex-col hover:border-[#003ec7]/50 transition-colors shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-[#c02f09]/10 text-[#c02f09] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">query_stats</span>
                </div>
                <h4 className="font-headline font-bold text-[#131b2e] mb-1 text-lg">
                  Progress Analytics
                </h4>
                <p className="text-sm text-[#434656] mb-6 leading-relaxed">
                  Deep insights into your strength gains, volume progression, and body composition changes.
                </p>

                {/* Mini Chart Mock */}
                <div className="flex-grow flex items-end gap-2.5 h-16 mt-auto pt-2">
                  <div className="w-full bg-[#003ec7]/20 rounded-t-md h-[30%]" />
                  <div className="w-full bg-[#003ec7]/40 rounded-t-md h-[45%]" />
                  <div className="w-full bg-[#003ec7]/60 rounded-t-md h-[60%]" />
                  <div className="w-full bg-[#003ec7]/80 rounded-t-md h-[80%]" />
                  <div className="w-full bg-[#003ec7] rounded-t-md h-[100%] relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#131b2e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      +12%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-10 bg-[#003ec7] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c1f100]/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

          <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
            <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Ready to transform your routine?
            </h3>
            <p className="text-base sm:text-lg opacity-90 max-w-xl">
              Join thousands of athletes and fitness enthusiasts training smarter with FitAI.
            </p>
            <button
              onClick={onStartOnboarding}
              className="mt-2 bg-[#c1f100] text-[#546b00] font-headline font-bold px-8 py-4 rounded-full shadow-xl shadow-black/20 hover:bg-[#c3f400] transition-all active:scale-95 text-lg cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Your Free Trial
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#283044] text-[#eef0ff] py-14 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b7c4ff] text-2xl material-symbols-fill">
                fitness_center
              </span>
              <span className="font-headline font-bold text-xl text-[#b7c4ff] tracking-tight">
                FitAI
              </span>
            </div>
            <p className="text-sm text-[#c3c5d9] leading-relaxed">
              Precision training and nutrition, powered by artificial intelligence.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h5 className="font-semibold text-white text-sm">Product</h5>
            <button
              onClick={onSeeDemo}
              className="text-left text-sm text-[#c3c5d9] hover:text-white transition-colors"
            >
              Workouts
            </button>
            <button
              onClick={onSeeDemo}
              className="text-left text-sm text-[#c3c5d9] hover:text-white transition-colors"
            >
              Nutrition Plans
            </button>
            <button
              onClick={onSeeDemo}
              className="text-left text-sm text-[#c3c5d9] hover:text-white transition-colors"
            >
              Progress Tracking
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <h5 className="font-semibold text-white text-sm">Company</h5>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              About Us
            </span>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              Careers
            </span>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              Contact
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h5 className="font-semibold text-white text-sm">Legal</h5>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-sm text-[#c3c5d9] hover:text-white transition-colors cursor-pointer">
              Disclaimer
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#737688]/30 text-center">
          <p className="text-xs text-[#c3c5d9]">
            © {new Date().getFullYear()} FitAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
