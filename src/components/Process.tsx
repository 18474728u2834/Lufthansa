import { UserPlus, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: UserPlus, step: '01', title: 'Create Your Account', description: 'Sign up with your email and a password. This is your portal for all future communications.' },
  { icon: ShieldCheck, step: '02', title: 'Verify Your Roblox Identity', description: 'Enter your Roblox username, add a unique code to your Roblox bio, and we confirm it is really you.' },
  { icon: FileText, step: '03', title: 'Submit Your Application', description: 'Choose your desired role and tell us about your experience. Applications are tied to your verified Roblox identity.' },
  { icon: CheckCircle2, step: '04', title: 'Get Reviewed', description: 'Our recruitment team reviews your application. Accepted applicants are contacted via Discord for onboarding.' },
];

export function Process() {
  return (
    <section id="process" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="section-label">How It Works</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Your Path to the Cockpit</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100">Four simple steps from sign-up to takeoff. The whole process takes less than 10 minutes.</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent lg:block" />
          {steps.map((item, i) => (
            <div key={i} className="relative">
              <div className="glass-card h-full p-6 transition-all duration-300 hover:border-gold-400/30">
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 ring-1 ring-gold-400/20">
                  <item.icon className="h-6 w-6 text-gold-400" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-navy-900">{item.step}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
