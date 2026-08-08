import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'C++ カード学習',
  description: 'カードを並べてC++を学ぼう！',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
