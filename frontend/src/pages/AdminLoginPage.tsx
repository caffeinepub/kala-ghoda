import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [error, setError] = useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (!actorFetching && !adminLoading && isAuthenticated && isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdmin, actorFetching, adminLoading, navigate]);

  const handleLogin = async () => {
    setError('');
    try {
      await login();
    } catch (err: unknown) {
      const e = err as Error;
      if (e?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="/assets/generated/hero-fallback.dim_1920x1080.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/assets/generated/logo-wordmark.dim_600x200.png"
            alt="Kala Ghoda"
            className="h-16 w-auto mx-auto object-contain mb-6"
          />
          <div className="divider-gold w-24 mx-auto mb-6" />
          <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="card-luxury p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 flex items-center justify-center border border-gold/30 text-gold">
              <Lock size={22} />
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-cinzel font-bold text-2xl text-foreground tracking-wider mb-2">
              Admin Access
            </h1>
            <p className="text-foreground/40 text-sm">
              Sign in with your Internet Identity to access the admin dashboard.
            </p>
          </div>

          {error && (
            <div className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {isAuthenticated && !isAdmin && !adminLoading && !actorFetching && (
            <div className="border border-gold/20 bg-gold/5 px-4 py-3 text-foreground/60 text-sm text-center">
              Your account does not have admin privileges.
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn || actorFetching || adminLoading}
            className="w-full py-4 btn-gold text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {isLoggingIn ? 'Connecting...' : actorFetching || adminLoading ? 'Verifying...' : isAuthenticated ? 'Checking Access...' : 'Login with Internet Identity'}
          </button>

          <div className="text-center">
            <a href="/" className="text-foreground/30 hover:text-gold text-xs font-cinzel tracking-widest uppercase transition-colors">
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
