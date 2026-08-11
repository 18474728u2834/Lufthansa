import { useEffect, useState } from 'react';
import { Plane, Menu, X } from 'lucide-react';

type NavbarProps = {
  onApplyClick: () => void;
  onSignInClick: () => void;
  isLoggedIn: boolean;
  displayName: string | null;
  onSignOut: () => void;
};

export function Navbar({ onApplyClick, onSignInClick, isLoggedIn, displayName, onSignOut }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Why Join', href: '#why-join' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'Positions', href: '#positions' },
    { label: 'Process', href: '#process' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-navy-950/80 backdrop-blur-xl py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#home" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 ring-1 ring-gold-400/30">
            <Plane className="h-5 w-5 text-gold-400 -rotate-45" />
          </div>
          <div className="leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-white">Lufthansa</span>
            <span className="ml-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">Roblox</span>
          </div>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-navy-100 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-navy-100">Hi, <span className="font-medium text-white">{displayName}</span></span>
              <button onClick={onApplyClick} className="btn-primary">My Application</button>
              <button onClick={onSignOut} className="text-sm font-medium text-navy-200 transition-colors hover:text-white">Sign out</button>
            </>
          ) : (
            <>
              <button onClick={onSignInClick} className="btn-ghost">Sign in</button>
              <button onClick={onApplyClick} className="btn-primary">Apply Now</button>
            </>
          )}
        </div>

        <button className="text-white lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="mt-3 border-t border-white/10 bg-navy-950/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-navy-100 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <button onClick={() => { onApplyClick(); setMobileOpen(false); }} className="btn-primary w-full">My Application</button>
                  <button onClick={() => { onSignOut(); setMobileOpen(false); }} className="btn-ghost w-full">Sign out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onSignInClick(); setMobileOpen(false); }} className="btn-ghost w-full">Sign in</button>
                  <button onClick={() => { onApplyClick(); setMobileOpen(false); }} className="btn-primary w-full">Apply Now</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
