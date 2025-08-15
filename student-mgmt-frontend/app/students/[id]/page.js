'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function StudentDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function change(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch(`/students/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      } else if (res.status === 404) {
        setError('Không tìm thấy sinh viên'); 
      }
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setError('');
    const payload = { ...form };
    delete payload._id; delete payload.__v; delete payload.createdAt; delete payload.updatedAt;
    const res = await apiFetch(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json().catch(()=>({message:'Lỗi cập nhật'}));
      setError(data.message || 'Lỗi cập nhật');
    } else {
      router.push('/');
    }
  }

  async function remove() {
    if (!confirm('Xoá sinh viên này?')) return;
    const res = await apiFetch(`/students/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <main className="py-10 opacity-80">Đang tải...</main>;
  if (!form) return <main className="py-10 text-red-400">{error || 'Không có dữ liệu'}</main>;

  return (
    <main className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sửa sinh viên</h1>
      <div className="card space-y-3">
        {['studentCode','fullName','email','phone','address'].map(k => (
          <input key={k} className="input" placeholder={k} value={form[k]||''} onChange={e=>change(k, e.target.value)} />
        ))}
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-2">
          <button className="btn" onClick={save}>Lưu</button>
          <button className="btn" onClick={() => router.push('/')}>Huỷ</button>
          <button className="btn" onClick={remove}>Xoá</button>
        </div>
      </div>
    </main>
  );
}
