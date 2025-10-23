'use client';

// TEMPORARY: All imports commented out while wallet authentication is disabled
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useFlowCurrentUser } from '@onflow/react-sdk';
// import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;

  /* COMMENTED OUT - Restore this code when wallet authentication is needed again
  const router = useRouter();
  const { user } = useFlowCurrentUser();

  useEffect(() => {
    // Redirect to landing page if not connected
    if (user && !user.loggedIn) {
      router.push('/');
    }
  }, [user, router]);

  // Show loading while checking auth status
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-400 mb-4 mx-auto" size={56} />
          <p className="text-gray-400 font-medium">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not logged in
  if (!user.loggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-400 mb-4 mx-auto" size={56} />
          <p className="text-gray-400 font-medium">Redirecting to connect wallet...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, show the page
  return <>{children}</>;
  */
}
