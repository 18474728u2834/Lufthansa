import { Plane, Users, Headphones, Wrench, Radio, Briefcase, ArrowRight } from 'lucide-react';

const positions = [
  { icon: Plane, title: 'Pilot', roles: ['Captain', 'First Officer'], description: 'Command our fleet across short-haul and long-haul routes. Complete type ratings and log flight hours.', open: true },
  { icon: Users, title: 'Cabin Crew', roles: ['Senior', 'Junior'], description: 'Deliver exceptional service onboard. Manage safety procedures and passenger comfort on every flight.', open: true },
  { icon: Headphones, title: 'Customer Service', roles: ['Gate Agent', 'Check-in'], description: 'Be the first point of contact at the terminal. Handle boarding, announcements, and passenger assistance.', open: true },
  { icon: Radio, title: 'Air Traffic Control', roles: ['Tower', 'Approach'], description: 'Coordinate arrivals and departures. Ensure safe separation and efficient flow across our hub airports.', open: false },
  { icon: Wrench, title: 'Aircraft Maintenance', roles: ['Line', 'Base'], description: 'Keep our fleet airworthy. Perform inspections, repairs, and routine maintenance checks between flights.', open: true },
  { icon: Briefcase, title: 'Ground Operations', roles: ['Ramp', 'Baggage'], description: 'Manage turnarounds, baggage handling, and ground support equipment. The engine behind every on-time departure.', open: true },
];

export function Positions({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section id="positions" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="section-label">Open Positions</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Find Your Role Onboard</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100">We are always looking for dedicated team members. Browse our open positions and apply with your verified Roblox account.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {positions.map((pos, i) => (
            <div key={i} className="glass-card group flex flex-col p-7 transition-all duration-300 hover:border-gold-400/30 hover:bg-white/[0.06]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20 transition-all duration-300 group-hover:bg-gold-400/20">
                  <pos.icon className="h-6 w-6 text-gold-400" />
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pos.open ? 'bg-green-400/10 text-green-300 ring-1 ring-green-400/20' : 'bg-navy-700/40 text-navy-300 ring-1 ring-white/5'}`}>
                  {pos.open ? 'Open' : 'Waitlist'}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{pos.title}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pos.roles.map((role) => (
                  <span key={role} className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-navy-100">{role}</span>
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-200">{pos.description}</p>
              {pos.open && (
                <button onClick={onApplyClick} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300">
                  Apply for this role
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
