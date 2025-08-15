'use client';
import { useState } from 'react';
import { apiFetch, setToken } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({message:'Đăng nhập thất bại'}));
        setError(data.message || 'Đăng nhập thất bại');
      } else {
        const data = await res.json();
        setToken(data.token || '');
        router.push('/');
      }
    } catch (err) {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={submit} className="card space-y-3">
        <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-400">{error}</div>}
        <button disabled={loading} className="btn">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
      <p className="opacity-70 mt-3 text-sm">Tip: dùng user dev đã tạo qua endpoint /api/auth/register.</p>
    </main>
  );
}
