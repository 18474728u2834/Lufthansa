const stats = [
  { value: '40+', label: 'Active Members' },
  { value: 'Daily', label: 'Flights' },
  { value: 'Roblox', label: 'Verified Crew' },
  { value: '4.9/5', label: 'Crew Rating' },
];

export function Stats() {
  return (
    <section className="relative z-10 -mt-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="glass-card grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="group flex flex-col items-center justify-center px-6 py-8 text-center transition-colors hover:bg-white/[0.03]">
              <span className="font-display text-3xl font-bold text-white transition-colors group-hover:text-gold-400 md:text-4xl">{stat.value}</span>
              <span className="mt-1.5 text-xs font-medium uppercase tracking-[0.15em] text-navy-200">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
