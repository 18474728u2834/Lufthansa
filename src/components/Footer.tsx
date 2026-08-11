import { Plane, Twitter, Youtube, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 ring-1 ring-gold-400/30">
                <Plane className="h-5 w-5 text-gold-400 -rotate-45" />
              </div>
              <div className="leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-white">Lufthansa</span>
                <span className="ml-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">Roblox</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
              The premier Roblox aviation group. Fly, serve, and lead across our global virtual network. This is a fan-made community and is not affiliated with the real-world Lufthansa Group.
            </p>
            <div className="mt-5 flex gap-3">
              {[MessageCircle, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-navy-200 transition-all hover:border-gold-400/30 hover:text-gold-400" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 space-y-3">
              {['Why Join', 'Fleet', 'Positions', 'Process'].map((label) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase().replace(' ', '-')}`} className="text-sm text-navy-200 transition-colors hover:text-gold-400">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Resources</h4>
            <ul className="mt-4 space-y-3">
              {['Discord Server', 'Pilot Handbook', 'Route Map', 'Support'].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-navy-200 transition-colors hover:text-gold-400">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-navy-300">© 2026 Lufthansa Roblox Aviation Group. Fan-made project, not affiliated with Deutsche Lufthansa AG.</p>
          <p className="text-xs text-navy-300">Built for the Roblox aviation community.</p>
        </div>
      </div>
    </footer>
  );
}
