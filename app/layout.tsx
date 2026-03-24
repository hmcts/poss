import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from './providers';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export const metadata: Metadata = {
  title: 'HMCTS Possessions Process Tool',
  description: 'Prototype tool for exploring HMCTS possession case processes, states, and events.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="flex h-screen overflow-hidden bg-[#0f172a]">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto px-8 py-6">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
