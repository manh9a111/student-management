'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, getToken } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function load(p = page) {
    setLoading(true);
    try {
      const res = await apiFetch(`/students?keyword=${encodeURIComponent(keyword)}&page=${p}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setPages(data.pages || 1);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) router.push('/login');
    else load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="py-6">
      <div className="flex gap-2 mb-4">
        <input className="input" placeholder="Tìm theo tên/mã/email" value={keyword} onChange={e=>setKeyword(e.target.value)} />
        <button className="btn" onClick={()=>{ setPage(1); load(1); }}>Tìm</button>
        <Link className="btn ml-auto" href="/students/new">+ Thêm SV</Link>
      </div>

      <div className="table">
        <table className="w-full">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s._id} className="hover:bg-white/5">
                <td>{s.studentCode}</td>
                <td>{s.fullName}</td>
                <td>{s.email}</td>
                <td>
                  <Link className="link" href={`/students/${s._id}`}>Xem/Sửa</Link>
                </td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr><td colSpan="4" className="text-center py-6 opacity-70">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button className="btn" disabled={page<=1} onClick={()=>{ const p = page-1; setPage(p); load(p); }}>Prev</button>
        <span>Trang {page}/{pages}</span>
        <button className="btn" disabled={page>=pages} onClick={()=>{ const p = page+1; setPage(p); load(p); }}>Next</button>
      </div>
    </main>
  );
}
