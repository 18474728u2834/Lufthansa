const fleet = [
  { name: 'Airbus A320neo', role: 'Short-haul', capacity: '180', range: '6,500 km' },
  { name: 'Airbus A350-900', role: 'Long-haul', capacity: '293', range: '15,000 km' },
  { name: 'Boeing 747-8', role: 'Ultra long-haul', capacity: '364', range: '14,100 km' },
  { name: 'Airbus A380-800', role: 'Super jumbo', capacity: '509', range: '15,200 km' },
  { name: 'Bombardier CRJ900', role: 'Regional', capacity: '90', range: '2,900 km' },
  { name: 'Airbus A321neo', role: 'Medium-haul', capacity: '220', range: '7,400 km' },
];

export function Fleet() {
  return (
    <section id="fleet" className="relative px-6 py-24">
      <div className="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/2898316/pexels-photo-2898316.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600" alt="Pilots in cockpit" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/90 to-navy-950" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="section-label">Our Fleet</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Modern Aircraft, Realistic Operations</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100">Train on the same aircraft Lufthansa flies in the real world. Each type rating unlocks new routes and destinations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((aircraft, i) => (
            <div key={i} className="glass-card group overflow-hidden p-6 transition-all duration-300 hover:border-gold-400/30 hover:bg-white/[0.06]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{aircraft.name}</h3>
                  <span className="text-xs font-medium uppercase tracking-wider text-gold-400">{aircraft.role}</span>
                </div>
              </div>
              <div className="flex gap-6 border-t border-white/10 pt-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-navy-300">Seats</span>
                  <p className="mt-0.5 font-display text-lg font-semibold text-white">{aircraft.capacity}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-navy-300">Range</span>
                  <p className="mt-0.5 font-display text-lg font-semibold text-white">{aircraft.range}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
