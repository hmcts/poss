'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      router.replace('/');
    } else {
      setError('Invalid access code. Please try again.');
      setCode('');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Statesmith</h1>
          <p className="mt-2 text-sm text-slate-400">Access restricted</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-1">
              Access code
            </label>
            <input
              id="code"
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter access code"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {loading ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
