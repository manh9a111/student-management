'use client';
import { useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NewStudent() {
  const [form, setForm] = useState({ studentCode: '', fullName: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function change(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await apiFetch('/students', { method: 'POST', body: JSON.stringify(form) });
      if (!res.ok) {
        const data = await res.json().catch(()=>({message:'Lỗi tạo sinh viên'}));
        setError(data.message || 'Lỗi tạo sinh viên');
      } else {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm sinh viên</h1>
      <form onSubmit={submit} className="card space-y-3">
        {['studentCode','fullName','email','phone','address'].map(k => (
          <input key={k} className="input" placeholder={k} value={form[k]||''} onChange={e=>change(k, e.target.value)} />
        ))}
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-2">
          <button className="btn" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
          <button type="button" className="btn" onClick={()=>router.push('/')}>Huỷ</button>
        </div>
      </form>
    </main>
  );
}
