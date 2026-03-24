import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HMCTS Possessions Process Tool',
  description: 'Prototype tool for exploring HMCTS possession case processes, states, and events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
