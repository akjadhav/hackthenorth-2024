// layout.tsx
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'PathSense',
  description: 'PathSense',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
