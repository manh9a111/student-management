'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, clearToken } from '../lib/api';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = !!getToken();

  function logout() {
    clearToken();
    router.push('/login');
  }

  return (
    <header className="border-b border-white/10">
      <div className="container py-4 flex items-center gap-4">
        <Link href="/" className="text-xl font-semibold">QLSV</Link>
        <nav className="flex gap-3">
          <Link className={`btn ${pathname === '/' ? 'bg-white/10' : ''}`} href="/">Danh sách</Link>
          <Link className={`btn ${pathname?.startsWith('/students/new') ? 'bg-white/10' : ''}`} href="/students/new">+ Thêm SV</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {!loggedIn ? (
            <Link className="btn" href="/login">Đăng nhập</Link>
          ) : (
            <button className="btn" onClick={logout}>Đăng xuất</button>
          )}
        </div>
      </div>
    </header>
  );
}
