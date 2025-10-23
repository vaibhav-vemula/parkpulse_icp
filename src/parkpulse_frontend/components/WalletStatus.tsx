'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, LogOut, LogIn } from 'lucide-react';
import { login, logout, getPrincipal, isAuthenticated, shortenPrincipal } from '@/lib/auth';

export default function WalletStatus() {
  const router = useRouter();
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const p = await getPrincipal();
        // Check if not anonymous
        if (p && p !== '2vxsx-fae') {
          setPrincipal(p);
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin() {
    try {
      setIsLoading(true);
      await login();
      await checkAuth();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setPrincipal(null);
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!principal) {
    return (
      <button
        onClick={handleLogin}
        className="fixed top-6 right-6 z-50 group flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full border-2 border-emerald-400 shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
      >
        <LogIn size={18} className="group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-sm">Login with Internet Identity</span>
      </button>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-900/90 backdrop-blur-md border-2 border-emerald-500/30 rounded-full shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <Wallet size={18} className="text-emerald-400" />
          <span className="text-sm font-semibold text-gray-200">
            {shortenPrincipal(principal)}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 p-1.5 hover:bg-slate-800 rounded-full transition-colors group"
          title="Logout"
        >
          <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
