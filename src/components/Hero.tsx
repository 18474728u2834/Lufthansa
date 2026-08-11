import { ArrowRight, BadgeCheck, Users2, Star } from 'lucide-react';

const heroImage = '/RobloxScreenShot20260803_223316133.png';

export function Hero({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Lufthansa aircraft at the gate in Roblox" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/60 to-navy-950" />
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 animate-fade-in">
            <Star className="h-3.5 w-3.5 text-gold-400" fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Now Hiring — Season 2026</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-up">
            Take Your Seat in the
            <span className="block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">Lufthansa Cockpit</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Join the premier Roblox aviation group. Verify your Roblox identity and apply to fly, serve, and lead across our global virtual network.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onApplyClick} className="btn-primary group">
              Start Your Application
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a href="#positions" className="btn-ghost">View Open Positions</a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-gold-400" />
              <span className="text-sm text-navy-100"><span className="font-semibold text-white">40+</span> active members</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-gold-400" />
              <span className="text-sm text-navy-100"><span className="font-semibold text-white">Roblox-verified</span> crew</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-400" fill="currentColor" />
              <span className="text-sm text-navy-100"><span className="font-semibold text-white">4.9/5</span> pilot rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
    </section>
  );
}
