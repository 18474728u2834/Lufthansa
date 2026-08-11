import { ShieldCheck, Globe2, GraduationCap, Award, Clock, Users } from 'lucide-react';

const reasons = [
  { icon: ShieldCheck, title: 'Verified & Trusted', description: 'Every crew member verifies their Roblox identity through our secure bio-code system. No alts, no fakes — just a real community.' },
  { icon: Globe2, title: 'Global Route Network', description: 'Fly to 45+ destinations across Europe, Asia, and the Americas. From Frankfurt hubs to long-haul intercontinental routes.' },
  { icon: GraduationCap, title: 'Structured Training', description: 'Comprehensive training programs for every role — from first-time pilots to senior cabin crew. Learn at your own pace.' },
  { icon: Award, title: 'Career Progression', description: 'Clear rank structure with promotions based on skill, dedication, and flight hours. Rise from cadet to captain.' },
  { icon: Clock, title: 'Flexible Schedule', description: 'No minimum hour requirements. Fly when you want, how you want — we accommodate real-life commitments.' },
  { icon: Users, title: 'Active Community', description: 'Join 2,400+ passionate aviators. Daily events, group flights, and a thriving Discord community.' },
];

export function WhyJoin() {
  return (
    <section id="why-join" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="section-label">Why Lufthansa Roblox</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">More Than Just Flying</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100">We are a community-driven airline that invests in every member. Here is what sets us apart from the rest.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="glass-card group p-7 transition-all duration-300 hover:border-gold-400/30 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20 transition-all duration-300 group-hover:bg-gold-400/20 group-hover:ring-gold-400/40">
                <reason.icon className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{reason.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-200">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
