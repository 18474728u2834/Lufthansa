import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  X, ShieldCheck, Loader2, CheckCircle2, AlertCircle,
  ExternalLink, Gamepad2, FileText, Rocket,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, POSITIONS, type RobloxVerification, type Application } from '@/lib/supabase';

type FlowState = 'loading' | 'auth' | 'verify_intro' | 'verify_pending' | 'verify_success' | 'application_form' | 'application_submitted';

type ApplicationModalProps = {
  open: boolean;
  onClose: () => void;
  onRequireAuth: () => void;
};

export function ApplicationModal({ open, onClose, onRequireAuth }: ApplicationModalProps) {
  const { user, loading: authLoading } = useAuth();
  const [flowState, setFlowState] = useState<FlowState>('loading');

  const [robloxUsername, setRobloxUsername] = useState('');
  const [verification, setVerification] = useState<RobloxVerification | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [existingApp, setExistingApp] = useState<Application | null>(null);
  const [fullName, setFullName] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [position, setPosition] = useState<string>(POSITIONS[0]);
  const [ageGroup, setAgeGroup] = useState<'13-15' | '16-17' | '18+'>('18+');
  const [experience, setExperience] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [appError, setAppError] = useState<string | null>(null);
  const [appLoading, setAppLoading] = useState(false);

  const reset = useCallback(() => {
    setRobloxUsername('');
    setVerification(null);
    setVerifyError(null);
    setVerifyLoading(false);
    setExistingApp(null);
    setFullName('');
    setDiscordUsername('');
    setPosition(POSITIONS[0]);
    setAgeGroup('18+');
    setExperience('');
    setWhyJoin('');
    setAppError(null);
    setAppLoading(false);
  }, []);

  const loadState = useCallback(async () => {
    if (!user) {
      setFlowState('auth');
      return;
    }

    setFlowState('loading');

    const { data: app } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (app) {
      setExistingApp(app as Application);
      setFlowState('application_submitted');
      return;
    }

    const { data: verif } = await supabase
      .from('roblox_verifications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (verif) {
      setVerification(verif as RobloxVerification);
      if (verif.status === 'verified') {
        setFlowState('verify_success');
      } else {
        setFlowState('verify_pending');
      }
    } else {
      setFlowState('verify_intro');
    }
  }, [user]);

  useEffect(() => {
    if (open && !authLoading) {
      loadState();
    }
    if (!open) {
      reset();
    }
  }, [open, authLoading, loadState, reset]);

  if (!open) return null;

  const startVerification = async () => {
    if (!user || !robloxUsername.trim()) return;
    setVerifyError(null);
    setVerifyLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roblox-verify`;
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'start', roblox_username: robloxUsername.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVerifyError(data.error || 'Failed to start verification');
        setVerifyLoading(false);
        return;
      }

      const { data: verif } = await supabase
        .from('roblox_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (verif) setVerification(verif as RobloxVerification);
      setFlowState('verify_pending');
    } catch {
      setVerifyError('Network error. Please try again.');
    }
    setVerifyLoading(false);
  };

  const checkBio = async () => {
    if (!user) return;
    setVerifyError(null);
    setVerifyLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roblox-verify`;
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'check' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVerifyError(data.error || 'Verification check failed');
        setVerifyLoading(false);
        return;
      }

      if (data.verified) {
        const { data: verif } = await supabase
          .from('roblox_verifications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (verif) setVerification(verif as RobloxVerification);
        setFlowState('verify_success');
      } else {
        setVerifyError(data.message || 'Code not found in your bio yet.');
      }
    } catch {
      setVerifyError('Network error. Please try again.');
    }
    setVerifyLoading(false);
  };

  const submitApplication = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !verification) return;
    setAppError(null);
    setAppLoading(true);

    try {
      const { data: app, error } = await supabase
        .from('applications')
        .insert({
          roblox_username: verification.roblox_username,
          roblox_user_id: verification.roblox_user_id,
          full_name: fullName,
          discord_username: discordUsername || null,
          position,
          experience,
          why_join: whyJoin,
          age_group: ageGroup,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (app) {
        setExistingApp(app as Application);
        setFlowState('application_submitted');
      }
    } catch (err) {
      setAppError(err instanceof Error ? err.message : 'Failed to submit application');
    }
    setAppLoading(false);
  };

  const showSteps = flowState !== 'loading' && flowState !== 'auth' && flowState !== 'application_submitted';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card p-8 animate-slide-down">
        <button onClick={onClose} className="absolute right-4 top-4 text-navy-200 transition-colors hover:text-white z-10" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {showSteps && (
          <div className="mb-6 flex items-center gap-2">
            {[
              { label: 'Verify', icon: ShieldCheck },
              { label: 'Apply', icon: FileText },
            ].map((step, i) => {
              const isActive =
                (i === 0 && (flowState === 'verify_intro' || flowState === 'verify_pending' || flowState === 'verify_success')) ||
                (i === 1 && flowState === 'application_form');
              const isDone =
                (i === 0 && flowState === 'verify_success') ||
                (i === 1 && flowState === 'application_submitted');

              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${isDone ? 'bg-green-400 text-navy-900' : isActive ? 'bg-gold-400 text-navy-900' : 'bg-white/5 text-navy-300'}`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${isActive || isDone ? 'text-white' : 'text-navy-300'}`}>{step.label}</span>
                  {i === 0 && <div className="mx-1 h-px w-6 bg-white/10" />}
                </div>
              );
            })}
          </div>
        )}

        {flowState === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
            <p className="mt-4 text-sm text-navy-200">Loading your application status…</p>
          </div>
        )}

        {flowState === 'auth' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/10 ring-1 ring-gold-400/30">
              <ShieldCheck className="h-7 w-7 text-gold-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Sign in to Apply</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-navy-200">
              You need an account to verify your Roblox identity and submit an application. It only takes a minute.
            </p>
            <button onClick={onRequireAuth} className="btn-primary mt-6 w-full">Sign in or Create Account</button>
          </div>
        )}

        {flowState === 'verify_intro' && (
          <div>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20">
                <Gamepad2 className="h-6 w-6 text-gold-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Verify Your Roblox Identity</h2>
              <p className="mt-2 text-sm text-navy-200">
                Enter your Roblox username. We will give you a unique code to add to your Roblox profile bio so we can confirm it is really you.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Roblox Username</label>
                <input
                  type="text"
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  placeholder="Your Roblox username"
                  className="input-field"
                  onKeyDown={(e) => e.key === 'Enter' && startVerification()}
                />
              </div>
              {verifyError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}
              <button onClick={startVerification} disabled={!robloxUsername.trim() || verifyLoading} className="btn-primary w-full disabled:opacity-50">
                {verifyLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Looking up…</> : <>Continue <ExternalLink className="h-4 w-4" /></>}
              </button>
              <p className="text-center text-xs text-navy-300">We use the official Roblox API to look up your account.</p>
            </div>
          </div>
        )}

        {flowState === 'verify_pending' && verification && (
          <div>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20">
                <ShieldCheck className="h-6 w-6 text-gold-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Add the Code to Your Bio</h2>
              <p className="mt-2 text-sm text-navy-200">Copy this code and paste it into your Roblox profile description (bio), then click verify below.</p>
            </div>

            <div className="mb-5 rounded-xl border border-gold-400/30 bg-gold-400/5 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-gold-400">Your verification code</span>
              <div className="mt-2 flex items-center justify-between gap-3">
                <code className="font-display text-2xl font-bold tracking-[0.15em] text-white">{verification.verification_code}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(verification.verification_code)}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-navy-100 transition-colors hover:border-gold-400/30 hover:text-gold-400"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-navy-900/60 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-navy-200">How to add it</span>
              <ol className="mt-2 space-y-1.5 text-sm text-navy-100">
                <li>1. Go to <span className="text-gold-400">roblox.com</span> and sign in</li>
                <li>2. Click your profile → <span className="text-gold-400">Edit Profile</span></li>
                <li>3. Paste the code in your <span className="text-gold-400">About</span> section</li>
                <li>4. Save, then come back and click verify</li>
              </ol>
              <a href="https://www.roblox.com/my/account#!/info" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 hover:text-gold-300">
                Open Roblox Profile <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {verifyError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setFlowState('verify_intro')} className="btn-ghost flex-1">Back</button>
              <button onClick={checkBio} disabled={verifyLoading} className="btn-primary flex-1 disabled:opacity-50">
                {verifyLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking…</> : <>Verify My Bio <ShieldCheck className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        )}

        {flowState === 'verify_success' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 ring-1 ring-green-400/30 animate-pulse-slow">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Identity Verified!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-navy-200">
              Your Roblox account <span className="font-semibold text-gold-400">{verification?.roblox_username}</span> has been verified. You can now submit your application.
            </p>
            <button onClick={() => setFlowState('application_form')} className="btn-primary mt-6 w-full">
              Continue to Application <FileText className="h-4 w-4" />
            </button>
          </div>
        )}

        {flowState === 'application_form' && (
          <form onSubmit={submitApplication} className="space-y-4">
            <div className="mb-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20">
                <FileText className="h-6 w-6 text-gold-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Submit Your Application</h2>
              <p className="mt-1.5 text-sm text-navy-200">Applying as <span className="font-semibold text-gold-400">{verification?.roblox_username}</span></p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Full Name / Display Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="What should we call you?" className="input-field" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Discord Username <span className="text-navy-400">(optional)</span></label>
              <input type="text" value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="username or username#1234" className="input-field" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="input-field cursor-pointer">
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos} className="bg-navy-900">{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Age Group</label>
              <div className="grid grid-cols-3 gap-2">
                {(['13-15', '16-17', '18+'] as const).map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeGroup(age)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${ageGroup === age ? 'border-gold-400/50 bg-gold-400/10 text-gold-400' : 'border-white/10 bg-navy-900/60 text-navy-200 hover:border-white/20'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Prior Experience</label>
              <textarea required value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Have you been in other Roblox airlines? What roles?" rows={3} className="input-field resize-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-200">Why do you want to join?</label>
              <textarea required value={whyJoin} onChange={(e) => setWhyJoin(e.target.value)} placeholder="Tell us what makes you a great fit for Lufthansa." rows={3} className="input-field resize-none" />
            </div>

            {appError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{appError}</span>
              </div>
            )}

            <button type="submit" disabled={appLoading} className="btn-primary w-full disabled:opacity-50">
              {appLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit Application <Rocket className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {flowState === 'application_submitted' && existingApp && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 ring-1 ring-green-400/30">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Application Submitted!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-navy-200">
              Thank you, <span className="font-semibold text-gold-400">{existingApp.full_name}</span>. Your application for <span className="font-semibold text-white">{existingApp.position}</span> is now under review.
            </p>

            <div className="mt-6 space-y-2 rounded-xl bg-navy-900/60 p-5 text-left">
              {[
                { label: 'Roblox Account', value: existingApp.roblox_username },
                { label: 'Position', value: existingApp.position },
                { label: 'Submitted', value: new Date(existingApp.created_at).toLocaleDateString() },
                { label: 'Status', value: existingApp.status.charAt(0).toUpperCase() + existingApp.status.slice(1) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-navy-300">{row.label}</span>
                  <span className="font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4 text-left">
              <p className="text-sm text-navy-100">
                <span className="font-semibold text-gold-400">Next step:</span> Join our Discord server and open a ticket. Our recruitment team will reach out with your interview schedule.
              </p>
            </div>

            <button onClick={onClose} className="btn-ghost mt-6 w-full">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
