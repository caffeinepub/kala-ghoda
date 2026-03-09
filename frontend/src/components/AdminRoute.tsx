import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!actorFetching && !adminLoading) {
      if (!isAuthenticated || !isAdmin) {
        navigate({ to: '/admin/login' });
      }
    }
  }, [isAuthenticated, isAdmin, actorFetching, adminLoading, navigate]);

  if (actorFetching || adminLoading) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-gold/60 tracking-widest text-sm">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
