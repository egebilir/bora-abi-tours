'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push('/admin');
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-ice-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
              <circle cx="18" cy="18" r="14" stroke="#fff" strokeWidth="2.5" />
              <path d="M18 8L19.5 16L18 17.5L16.5 16L18 8Z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Komuta Merkezi</h1>
          <p className="text-sm text-neutral-500 mt-2">Devam etmek için yetkili girişi yapın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">E-posta Adresi</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500 transition-all placeholder:text-neutral-400"
              placeholder="admin@toursales.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Kasa Şifresi</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500 transition-all placeholder:text-neutral-400"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center mt-2 shadow-sm"
          >
            {loading ? <span className="animate-pulse">Doğrulanıyor...</span> : 'Kasaya Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
