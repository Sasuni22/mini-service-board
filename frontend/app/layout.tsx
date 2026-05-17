import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'ServiceBoard',
  description: 'Mini Service Request Board',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {/* Full-page shell: sidebar left, content right */}
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* Right column: topbar + scrollable page content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto bg-[#F1F3F9]">
                {children}
              </main>
              <footer className="shrink-0 border-t border-slate-200 bg-white py-3 text-center text-[11px] text-slate-400">
                © 2026 SERVICEBOARD INC. ALL RIGHTS RESERVED.
                <span className="mx-3 opacity-40">|</span>
                <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
                <span className="mx-2 opacity-40">·</span>
                <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                <span className="mx-2 opacity-40">·</span>
                <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
              </footer>
            </div>
          </div>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              borderRadius: '10px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            },
            success: { iconTheme: { primary: '#2353E8', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
