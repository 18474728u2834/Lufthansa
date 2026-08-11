import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { WhyJoin } from '@/components/WhyJoin';
import { Fleet } from '@/components/Fleet';
import { Positions } from '@/components/Positions';
import { Process } from '@/components/Process';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { ApplicationModal } from '@/components/ApplicationModal';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);

  const openApplication = useCallback(() => setAppModalOpen(true), []);
  const openAuth = useCallback(() => setAuthModalOpen(true), []);

  const handleAuthSuccess = useCallback(() => {
    setAuthModalOpen(false);
    setAppModalOpen(true);
  }, []);

  const handleRequireAuth = useCallback(() => {
    setAppModalOpen(false);
    setAuthModalOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar
        onApplyClick={openApplication}
        onSignInClick={openAuth}
        isLoggedIn={!!user}
        displayName={user?.email?.split('@')[0] ?? null}
        onSignOut={signOut}
      />

      <main>
        <Hero onApplyClick={openApplication} />
        <Stats />
        <WhyJoin />
        <Fleet />
        <Positions onApplyClick={openApplication} />
        <Process />
      </main>

      <Footer />

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
      <ApplicationModal open={appModalOpen} onClose={() => setAppModalOpen(false)} onRequireAuth={handleRequireAuth} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
