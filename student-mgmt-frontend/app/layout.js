export const metadata = {
  title: 'Student Management',
  description: 'Student Management Frontend (Next.js)',
};

import './globals.css';
import NavBar from '../components/NavBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="container py-6">{children}</div>
      </body>
    </html>
  );
}
